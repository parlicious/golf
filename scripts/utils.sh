#!/usr/bin/env bash

function deploy_lambda(){
    local FUNCTION_NAME=$1
    mkdir -p dist
    zip -r dist/${FUNCTION_NAME}.zip index.js node_modules
    aws s3 cp dist/${FUNCTION_NAME}.zip s3://parlicious-functions
    aws lambda update-function-code --function-name ${FUNCTION_NAME} --s3-bucket parlicious-functions --s3-key ${FUNCTION_NAME}.zip
    aws lambda publish-version --function-name ${FUNCTION_NAME}
}
