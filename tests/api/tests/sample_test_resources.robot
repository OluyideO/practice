*** Settings ***

Library  Collections

Resource    ../resources/libraries/api_requests.robot
Resource    ../resources/variables.robot

*** Keywords ***

#/
Get Sample-response
  [Arguments]    ${API_KEY}    ${EXPECTED_STATUS}
  &{response}=    Do GET Request    ${ROOT_API_URL}/    ${API_KEY}
  Log  'Content response status: ' ${response['status']}
  Validate Response    ${response}    get_sample_response_${EXPECTED_STATUS}.json    ${EXPECTED_STATUS}
