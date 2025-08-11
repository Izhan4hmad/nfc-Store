#!/bin/bash
# Define the bucket name variable
BUCKET_NAME="smsgatewaydashbaordv2"
# DISTRIBUTION_ID="E2NGSECDD78WMO"
AWS_PROFILE="gary"
npm run build
aws --profile $AWS_PROFILE s3 ls s3://$BUCKET_NAME/
aws --profile $AWS_PROFILE s3 cp build/ s3://$BUCKET_NAME/ --recursive
# aws --profile $AWS_PROFILE cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"