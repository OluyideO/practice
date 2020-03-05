import {config as awsConfig} from "aws-sdk";

process.env.DEBUG = 'true';

import { handleEvent } from "./apiHandler";
import { createApiEvent } from "./test-utils/apiGatewayUtil";
import * as datemock from "jest-date-mock";
import  * as sigv4client from "./aws/sigv4client"

describe('apiHandler', () => {

  const requestSigned = jest.spyOn(sigv4client, 'requestSigned');

  beforeAll(() => {
    awsConfig.region = 'eu-central-1';
    requestSigned.mockImplementation(() => Promise.resolve(mockResponse));
    datemock.advanceTo(new Date('2019-07-31'));
  });
  afterAll(() => {
    delete awsConfig.region;
    datemock.clear();
    requestSigned.mockReset();
  });

  it('serve a simple GET request', async () => {

    // execute the handler
    const result = await handleEvent(createApiEvent({
      method: "get",
      path: "/"
    }));

    // assertions
    expect(requestSigned).toHaveBeenCalledWith({
      "body": undefined,
      "headers":  {
        "Content-Type": "application/json",
        "x-api-key": "FIXME",
      },
      "json": true,
      "method": "get",
      "qs": undefined,
      "uri": "ROOT_ENDPOINT/",
    });
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockResponse.body));
  });

});

// mock response
let mockResponse: any = {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': '16'
  },
  body: {
    'message': 'ok'
  }
};
