*** Settings ***

Library    REST
Library    Collections

*** Keywords ***

Do GET Request
  [Arguments]    ${CONTENT_API_URL}    ${API_KEY}    ${AUTHORIZATION}
  Set Headers    { "x-api-key": "${API_KEY}", "Authorization": "${AUTHORIZATION}" }
  &{response}=    GET    ${CONTENT_API_URL}
  [Return]    ${response}

Do POST Request
  [Arguments]    ${CONTENT_API_URL}    ${API_KEY}    ${AUTHORIZATION}    ${BODY}
  Set Headers    { "x-api-key": "${API_KEY}", "Authorization": "${AUTHORIZATION}" }
  &{response}=    POST    ${CONTENT_API_URL}    ${BODY}
  [Return]    ${response}

Do POST Request Without Redirect
  [Arguments]    ${CONTENT_API_URL}    ${API_KEY}    ${BODY}
  Set Headers    { "x-api-key": "${API_KEY}", "Authorization": "${AUTHORIZATION}" }
  &{response}=    POST    ${CONTENT_API_URL}    ${BODY}    3000    false
  [Return]    ${response}

Validate Response
  [Arguments]    ${response}    ${schema_name}    ${EXPECTED_STATUS}
  _Validate Response Status    ${EXPECTED_STATUS}
  _Validate Response Body    ${response}    ${schema_name}

Validate Status Only
  [Arguments]    ${EXPECTED_STATUS}
  _Validate Response Status    ${EXPECTED_STATUS}

### Private ###
_Validate Response Status
  [Arguments]    ${EXPECTED_STATUS}
  Integer    response status    ${EXPECTED_STATUS}

_Validate Response Body
  [Arguments]    ${response}    ${schema_path}
  Validate Json    ${schema_path}    ${response.body}