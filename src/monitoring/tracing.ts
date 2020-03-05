import {config} from "../config";

export class Tracing {
  public static initialize(): void {
    if (config.xray.enabled) {
      const AWSXRay = require("aws-xray-sdk");
      AWSXRay.captureAWS(require("aws-sdk"));
      AWSXRay.captureHTTPsGlobal(require("http"));
    }
  }
}