import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
//import { logger } from './logger';
import { config } from './config';
import { Tracing } from "./monitoring/tracing";
//import { commons } from 'com-finnair-crew-services-commons';

Tracing.initialize();

export async function handleEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log(`API Gateway Request ID: ${event.requestContext.requestId}`);
  console.log(`API Caller Principal ID: ${event.requestContext.authorizer ? event.requestContext.authorizer.principalId : 'undefined'}`);
  console.log(`
    HTTP request: ${event.httpMethod} ${event.path} 
    Query params: ${event.queryStringParameters ? JSON.stringify(event.queryStringParameters) : '-'}
    Body: ${event.body || '-'}`);
  const params = getParameters(event);
  try {

    // MAIN LAMBDA EVENT HANDLER LOGIC GOES HERE
    console.log(JSON.stringify(params), JSON.stringify(config));

  } catch (error) {
    console.log(`Error: ${error}`);
    throw error;
  }

  return formResponse({statusCode: 200, body: {message: 'success'}});
}

function getParameters(event: any) {
  return {
    method: event.httpMethod,
    path: event.path,
    body: event.body,
    qsParams: event.queryStringParameters
  };
}

function formResponse(resp: any) {
  const defaultHeaders = {
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json; charset=utf-8",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy": "block-all-mixed-content; default-src *.finnair.com"
  }

  let response = {
      statusCode: resp.statusCode,
      headers: defaultHeaders,
      isBase64Encoded: false,
      body: JSON.stringify(resp.body)
  }
  return response;
}
