*** Variables ***

# Environment-specific API URLs

${TEST_URL}=  https://api-test.finnair.com/c/int-apps/int-apps-serverless-node-ts
${DEV_URL}=  https://api-dev.finnair.com/c/int-apps/int-apps-serverless-node-ts

&{API_URLS}  test=${TEST_URL}  dev=${DEV_URL}

${AUTHORIZATION}=   Bearer mock-allow
${TEST_API_KEY}=     9ff8d337-1764-4cd0-ac9b-f157dfd02303

&{API_KEYS}    dev=${TEST_API_KEY}   test=${TEST_API_KEY}
${API_KEY}=    &{API_KEYS}[${ENV}]

${ROOT_API_URL}  &{API_URLS}[${ENV}]
