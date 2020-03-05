#!/bin/bash

GITHUB_ORG_NAME=FinnairOyj
REPOSITORY_URL=https://${GITHUB_OAUTH_TOKEN}@github.com/${GITHUB_ORG_NAME}/${GIT_REPOSITORY_NAME}.git

if [[ ! -z "$CODEBUILD_RESOLVED_SOURCE_VERSION" ]]; then
    if [[ ! -d ".git" ]]; then
        echo "Initializing repository..."
        git init
        git remote add origin ${REPOSITORY_URL}
    fi

    echo "Fetching metadata..."
    git fetch

    echo "Checking out branch ${GIT_BRANCH}..."
    git checkout -f "${GIT_BRANCH}"

    COMMIT_HASH=$(git rev-parse HEAD)
    if [[ "$COMMIT_HASH" != "$CODEBUILD_RESOLVED_SOURCE_VERSION" ]]; then
        echo "Commit hash does not match CodeBuild resolved source version, aborting..."
        exit 1
    else
        echo "Commit hash is ${CODEBUILD_RESOLVED_SOURCE_VERSION}"
    fi
fi
