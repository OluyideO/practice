#!/bin/bash

#PROJECT=int-apps-serverless-node-ts

function run {
  validate_parameters $@
  set_variables $@
  deploy $@

  if [ $? -ne 0 ]
  then
     exit 1
  fi
}

function validate_parameters {
  if [[ "$#" -ne 1 ]] && [[ "$#" -ne 2 ]]; then
          echo "Invalid number of parameters!"
          echo "Usage: $0 <*|preprod|prod> $1 <branch> (optional, for dev environments)"
          exit 1
  else
          echo "Found valid number of parameters!"
  fi;
}

function set_variables {
  OPT_ENVIRONMENT=$1
  OPT_BRANCH=$2
  ENVIRONMENT=$OPT_ENVIRONMENT
  #AWS_PROFILE="$PROJECT-$ENVIRONMENT"
  BRANCH=$ENVIRONMENT

  if [ $ENVIRONMENT != "preprod" ] && [ $ENVIRONMENT != 'prod' ]; then
    #AWS_PROFILE="$PROJECT-dev"
    BRANCH=$OPT_BRANCH
  fi;
}

function deploy {
  echo "Switching to AWS profile: $AWS_PROFILE"
  #export AWS_PROFILE=$AWS_PROFILE
  echo "Using branch: $BRANCH"
  export GIT_BRANCH=$BRANCH
  echo "Deploying to environment: $ENVIRONMENT"
  serverless deploy --verbose --stage $ENVIRONMENT
}

run $@