#!/bin/bash
set -e

LIFECYCLE=${1}
WEBSITE_BUCKET_NAME="${LIFECYCLE}.parlicious.com"

if [ -z ${LIFECYCLE} ] ; then
    echo "You must enter a lifecycle. CAUTION: uat AND prod ARE RESERVED BY THE PIPELINE"
    echo "USAGE: build.sh <LIFECYCLE>"
    exit 2
fi

terraform/scripts/terraform-init.sh parlicious ${LIFECYCLE}

cd terraform/parlicious

terraform apply --auto-approve -var-file ${LIFECYCLE}.tfvars

cd - > /dev/null

aws s3 sync web/dist s3://${WEBSITE_BUCKET_NAME}
