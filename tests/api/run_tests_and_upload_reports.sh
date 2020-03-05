#!/bin/sh
ENVIRONMENT=$1

if pabot --processes 6 -v ENV:$ENVIRONMENT --outputdir reports --variablefile variables.py --pythonpath libraries/ --noncritical noncritical tests ;
 then
  echo "Starting API test report S3 upload (environment: $ENVIRONMENT)..."
  aws s3 sync --delete reports "s3://finnair-int-apps-serverless-node-ts-$ENVIRONMENT/api-test-results"
  echo "Finished upload successfully"
 else
  echo "Starting failed API test report S3 upload (environment: $ENVIRONMENT)..."
  aws s3 sync --delete reports "s3://finnair-int-apps-serverless-node-ts-$ENVIRONMENT/api-test-results"
  exit 1
fi
