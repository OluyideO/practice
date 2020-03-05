#!/bin/bash

function run {
  ENVIRONMENT=$1
  REGION=eu-central-1

  validate_parameters $ENVIRONMENT
  deploy_authorizer
  deploy_api

  if [ $? -ne 0 ]
  then
     exit 1
  fi
}

function validate_parameters {
  if [ "$#" -ne 1 ]; then
          echo "Invalid number of parameters!"
          echo "Usage: $0 <*|test|preprod|prod>"
          exit 1
  else
          echo "Found valid number of parameters!"
  fi;
}

function deploy_authorizer {
  cd components/authorizer
  ../../node_modules/serverless/bin/serverless deploy --verbose --force --stage $ENVIRONMENT
  cd ../..
}

function deploy_api {
  ./node_modules/serverless/bin/serverless deploy --verbose --force --stage $ENVIRONMENT
}

run $@