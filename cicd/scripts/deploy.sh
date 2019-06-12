#!/bin/bash
set -e

LIFECYCLE=${1}
WEBSITE_BUCKET_NAME="${LIFECYCLE}.parlicious.com"
DATA_BUCKET_NAME="parlicious-data-${LIFECYCLE}"

if [ -z ${LIFECYCLE} ] ; then
    echo "You must enter a lifecycle. CAUTION: uat AND prod ARE RESERVED BY THE PIPELINE"
    echo "USAGE: build.sh <LIFECYCLE>"
    exit 2
fi

terraform/scripts/terraform-init.sh parlicious ${LIFECYCLE}

echo "** TF Init Done **"

cd terraform/parlicious

terraform apply --auto-approve -var-file ${LIFECYCLE}.tfvars

echo "** TF Apply Done **"

cd - > /dev/null

aws s3 sync web/dist s3://${WEBSITE_BUCKET_NAME}

echo "** UI Bucket Sync Done **"

aws s3 ls s3://${DATA_BUCKET_NAME} --summarize | grep "Total Objects:"

TOTAL_OBJECTS=$(aws s3 ls s3://${DATA_BUCKET_NAME} --summarize  | grep "Total Objects:")

echo "Total Objects: $TOTAL_OBJECTS"

if [ "Total Objects: 0" == "${TOTAL_OBJECTS}" ] ; then
    aws s3 sync datatemplates s3://${DATA_BUCKET_NAME}
    echo "** Copied Control Data objects **"
else
    echo "** Control Data objects already exist **"
fi

echo "** Control Data Bucket Sync Done **"

if [ "prod" == "${LIFECYCLE}" ]; then
    echo '** Copying to production UI buckets **'
    aws s3 sync web/dist s3://parlicious.com
    aws s3 sync web/dist s3://www.parlicious.com
    aws cloudfront create-invalidation --distribution-id E3PILKX8V8E4Z1 --paths *
fi
