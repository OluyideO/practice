#!/bin/bash
set -e

cat <<EOF >./.npmrc
registry=https://nexus.code.tools.cloud.finnair.com/nexus/content/repositories/npm/
always-auth=true
_auth="$(aws --region=eu-central-1 ssm get-parameter --name "/nexus/npm-registry-read-token" | grep Value | cut -d \" -f4)"
email=npm-publish-placeholder@finnair.com
EOF