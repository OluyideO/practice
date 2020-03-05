#!/bin/bash
# Extract API URL from Serverless response (first URL from the input)
API_URL=$(echo "$sls" | grep -Eo -m 1 '(https?|ftp|file)://[-A-Za-z0-9\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\+&@#/%=~_|]')
# Cuts from the second slash to the first dot of the URL
# https://[ocv7m9aath].execute-api.eu-central-1.amazonaws.com/devjani/products/
echo $API_URL | cut -d "/" -f3- | cut -d "." -f1