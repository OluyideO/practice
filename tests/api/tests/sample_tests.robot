*** Settings ***

Library    OperatingSystem
Library    JSONSchemaLibrary    schemas
Resource    sample_test_resources.robot


*** Test Cases ***

Get Sample
  Get Sample-response    API_KEY=${API_KEY}    EXPECTED_STATUS=200
