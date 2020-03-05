import {APIGatewayProxyEvent} from "aws-lambda";

interface EventProperties {
  method: string;
  path: string;
  queryParameters?: { [name: string]: string };
  pathParameters?: { [name: string]: string };
  headers?: { [name: string]: string };
  requestContext?: { authorizer?: { principalId: string } };
  body?: any;
}

const defaultRequestContext: any = {
  requestId: "testRequestId123",
  authorizer: {
    principalId: "testPrincipalId"
  }
};

export function createApiEvent({
  method: httpMethod,
  path,
  pathParameters,
  queryParameters: queryStringParameters,
  headers,
  requestContext,
  body
}: EventProperties): APIGatewayProxyEvent {
  return {
    httpMethod,
    path,
    queryStringParameters,
    body,
    headers,
    pathParameters,
    requestContext: requestContext as any || defaultRequestContext,
    isBase64Encoded: false,
    stageVariables: null,
    resource: null,
    multiValueQueryStringParameters: null,
    multiValueHeaders: null
  };

}
