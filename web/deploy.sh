#!/usr/bin/env bash

npm run build
aws s3 sync dist s3://parlicious.com
aws s3 sync dist s3://www.parlicious.com
aws cloudfront create-invalidation --distribution-id E3PILKX8V8E4Z1 --paths "/*"