import {config as awsConfig} from "aws-sdk";
import * as datemock from "jest-date-mock";
import * as sigv4client from "./sigv4client";

describe("SigV4Client", (): void => {

  process.env.AWS_DEFAULT_REGION = "eu-central-1";
  process.env.AWS_ACCESS_KEY_ID = "fakeAccessKeyId";
  process.env.AWS_SECRET_ACCESS_KEY = "fakeSecretAccessKey";

  beforeAll((): void => {
    awsConfig.region = "eu-central-1";
    datemock.advanceTo(new Date("2019-07-31"));
  });
  afterAll((): void => {
    delete awsConfig.region;
    datemock.clear();
  });

  it("signs a simple GET request without body", async (): Promise<void> => {
    const request = await sigv4client.signRequest(
      {
        uri: "https://localhost/some/path:unencoded",
        method: "GET"
      }
    );
    expect(request).toStrictEqual({
      "uri": "https://localhost/some/path:unencoded",
      "method": "GET",
      "service": "execute-api",
      "host": "localhost",
      "path": "/some/path%3Aunencoded",
      "region": "eu-central-1",
      "resolveWithFullResponse": true,
      "doNotEncodePath": true,
      "simple": false,
      "headers": {
        "Accept": "application/json",
        "User-Agent": "TechopsDigitalizationProxy",
        "Host": "localhost",
        "X-Amz-Date": "20190731T000000Z",
        "Authorization": "AWS4-HMAC-SHA256 Credential=fakeAccessKeyId/20190731/eu-central-1/execute-api/aws4_request, SignedHeaders=accept;host;user-agent;x-amz-date, Signature=c305a5c48cd7d5fbd3e304b22aa72c415511abe9dd790a3c8d7621afd537b019"
      }
    });
  });

  it("signs a simple POST request with body and query string", async (): Promise<void> => {
    const requestBody = "{ testKey: testValue }";
    const request = await sigv4client.signRequest(
      {
        uri: "https://localhost/some/path",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        qs: {a: "1", b: "1:"},
        body: requestBody
      }
    );
    expect(request).toStrictEqual({
      "uri": "https://localhost/some/path?a=1&b=1%3A",
      "method": "POST",
      "headers": {
        "Accept": "application/json",
        "User-Agent": "TechopsDigitalizationProxy",
        "Content-Type": "application/json",
        "Host": "localhost",
        "Content-Length": 22,
        "X-Amz-Date": "20190731T000000Z",
        "Authorization": "AWS4-HMAC-SHA256 Credential=fakeAccessKeyId/20190731/eu-central-1/execute-api/aws4_request, SignedHeaders=accept;content-length;content-type;host;user-agent;x-amz-date, Signature=8cfd884bc8030e3b55843ae2b3e233076ba88c0f5c10dc3be9ca9aea5ea8c878"
      },
      "qs": {
        "a": "1",
        "b": "1:"
      },
      "body": requestBody,
      "service": "execute-api",
      "host": "localhost",
      "path": "/some/path?a=1&b=1%3A",
      "region": "eu-central-1",
      "resolveWithFullResponse": true,
      "doNotEncodePath": true,
      "simple": false
    });
  });
});
