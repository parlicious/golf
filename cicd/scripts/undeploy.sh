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

aws s3 rm --recursive s3://${WEBSITE_BUCKET_NAME}
aws s3 rm --recursive s3://${DATA_BUCKET_NAME}

terraform/scripts/terraform-init.sh parlicious ${LIFECYCLE}

cd terraform/parlicious

terraform destroy --auto-approve -var-file ${LIFECYCLE}.tfvars

cd - > /dev/null


