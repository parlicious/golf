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

echo "** CD Done **"

aws s3 sync web/dist s3://${WEBSITE_BUCKET_NAME}

echo "** UI Bucket Sync Done **"

TOTAL_OBJECTS=$(aws s3 ls s3://${DATA_BUCKET_NAME} --summarize  | grep "Total Objects: 0")

echo $TOTAL_OBJECTS

if [ "Total Objects: 0" == "${TOTAL_OBJECTS}" ] ; then
    aws s3 sync datatemplates s3://${DATA_BUCKET_NAME}
fi

echo "** Control Data Bucket Sync Done **"
