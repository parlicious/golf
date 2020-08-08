#!/usr/bin/env bash

npm run build
git rev-parse HEAD >> dist/commit
aws s3 sync dist s3://prod.parlicious.com --delete
aws cloudfront create-invalidation --distribution-id E3PILKX8V8E4Z1 --paths "/*"