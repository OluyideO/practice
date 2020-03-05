export interface XRayConfiguration {
  enabled: boolean;
}

export interface Configuration {
  xray: XRayConfiguration;
  environment: string;
  debug: boolean;
  commitHash: string;
  isOffline: boolean;
}

const environment = process.env.ENVIRONMENT || "offline";

export const config: Configuration = {
  xray: {
    enabled: (process.env.TRACING_ENABLED || "false").toLowerCase() === "true"
  },
  environment,
  debug: (process.env.DEBUG || "false").toLowerCase() === "true",
  commitHash: process.env.COMMIT_HASH,
  isOffline: !!process.env.IS_OFFLINE
};