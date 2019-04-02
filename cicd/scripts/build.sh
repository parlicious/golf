#!/bin/bash
set -e

LIFECYCLE=${1}
DATA_BUCKET_NAME="parlicious-data-${LIFECYCLE}"

if [ -z ${LIFECYCLE} ] ; then
    echo "You must enter a lifecycle. CAUTION: uat AND prod ARE RESERVED BY THE PIPELINE"
    echo "USAGE: build.sh <LIFECYCLE>"
    exit 2
fi

LAMBDA_FOLDERS=$(ls lambdas | awk ' BEGIN { ORS = ""; print "["; } { print "\/\@"$0"\/\@"; } END { print "]"; }' | sed "s^\"^\\\\\"^g;s^\/\@\/\@^\", \"^g;s^\/\@^\"^g")

cd web

eval "cat << EOF
$(<src/common/config.js.tmpl)
EOF
" > src/common/config.js

npm install
npm run build

cd - > /dev/null

cat > terraform/parlicious/${LIFECYCLE}.tfvars << EOF
lambda_folders = ${LAMBDA_FOLDERS}
data_bucket_name = "${DATA_BUCKET_NAME}"
EOF
