#!/bin/bash

TERRAFORM_FOLDER=${1}
LIFECYCLE=${2-"dev"}
AWS_REGION="us-east-1"

if [ -z ${TERRAFORM_FOLDER} ] ; then
    echo "No parameter set. Usage: terraform-init.sh <codebuild|parlicious> [lifecycle]"
    exit 2
fi

if ! [[ ${TERRAFORM_FOLDER} =~ ^(codebuild|parlicious)$ ]] ; then
    echo "Invalid parameter. Usage: terraform-init.sh <codebuild|parlicious> [lifecycle]"
    exit 2
fi

S3_BUCKET_NAME="parlicious-terraform-${AWS_REGION}-$(aws sts get-caller-identity --output text --query 'Account')"
S3_BUCKET_KEY="${TERRAFORM_FOLDER}/${LIFECYCLE}"

aws s3api create-bucket --bucket ${S3_BUCKET_NAME} --acl private --region ${AWS_REGION}

if [ $? != 0 ]; then
    echo "Failed to create s3 backend bucket"
    exit 1
fi

# Get tf path and cd to it
TERRAFORM_FOLDER_PATH="$(dirname ${0})/../${TERRAFORM_FOLDER}"
cd ${TERRAFORM_FOLDER_PATH}

terraform init \
    -backend-config="bucket=${S3_BUCKET_NAME}" \
    -backend-config="key=${S3_BUCKET_KEY}" \
    -backend-config="region=${AWS_REGION}"
