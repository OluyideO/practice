#!/bin/bash

ENVIRONMENT=$1
GIT_BASE_BRANCH=master
GITHUB_ORG_NAME=FinnairOyj

get_pr_number() {
    local request_url="https://api.github.com/repos/${GITHUB_ORG_NAME}/${GIT_REPOSITORY_NAME}/pulls?state=open&base=${GIT_BASE_BRANCH}&head=${GITHUB_ORG_NAME}:${GIT_BRANCH}"
    local pr_number=$(curl -s "${request_url}" -H 'Authorization: token '"${GITHUB_OAUTH_TOKEN}"'' | jq ".[0].number")
    echo ${pr_number}
}

get_version() {
    echo $(node deployment/pipeline/resources/buildspec/scripts/get-version.js)
}

get_branch_analysis_options() {
    echo "-Dsonar.branch.name=${GIT_BRANCH}"
}

get_pull_request_analysis_options() {
    echo "-Dsonar.pullrequest.key=${pr_number} -Dsonar.pullrequest.base=${GIT_BASE_BRANCH} -Dsonar.pullrequest.branch=${GIT_BRANCH}"
}

execute_sonar() {
    if [[ "$ENVIRONMENT" != "prod" ]] && [[ "$ENVIRONMENT" != "test" ]]; then
        local version=$(get_version)
        local pr_number=$(get_pr_number)
        local options=""

        if [[ "$pr_number" != "null" ]]; then
            echo "Updating SonarCloud for pull request #${pr_number} ${GIT_BRANCH} -> ${GIT_BASE_BRANCH}..."
            options=$(get_pull_request_analysis_options)
        else
            echo "Updating SonarCloud for branch ${GIT_BRANCH}..."
            options=$(get_branch_analysis_options)
        fi

        npm run sonar -- -Dsonar.login=${SONARCLOUD_TOKEN} -Dsonar.projectVersion=${version} ${options}
    fi
}

execute_sonar
