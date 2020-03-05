import {config as awsConfig} from "aws-sdk";
import * as aws4 from "aws4";
import * as queryString from "query-string";
import {OptionsWithUri, Response} from "request";
import * as requestPromise from "request-promise";
import * as url from "url";
import {logger} from "../logger";

export class SignV4Client {

  public async sign(request: OptionsWithUri): Promise<OptionsWithUri> {
    const targetURL = url.parse(request.uri as string);
    const queryParams = request.qs ? "?" + queryString.stringify(request.qs) : "";
    const {path, host} = targetURL;

    const signedRequest = aws4.sign(
      this.removeNullValues({
        ...request,
        service: "execute-api",
        region: awsConfig.region,
        host,
        path: `${path}${queryParams}`,
        uri: `https://${host}${path}${queryParams}`,
        doNotEncodePath: true,
        resolveWithFullResponse: true,
        simple: false,
        headers: {
          Accept: "application/json",
          "User-Agent": "TechopsDigitalizationProxy",
          ...request.headers
        }
      })
    );
    logger.debug(`Signed request:\n${JSON.stringify(signedRequest, null, 2)}`);
    return signedRequest;
  }

  public async request(request: OptionsWithUri): Promise<Response> {
    return requestPromise(await this.sign(request));
  }

  private removeNullValues(awsRequest): void {
    return JSON.parse(JSON.stringify(awsRequest));
  }
}

export async function signRequest(request: OptionsWithUri): Promise<OptionsWithUri> {
  return new SignV4Client().sign(request);
}

export async function requestSigned(request: OptionsWithUri): Promise<Response> {
  return new SignV4Client().request(request);
}