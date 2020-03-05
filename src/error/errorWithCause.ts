import {VError} from "verror";

export class ErrorWithCause extends VError {
  public constructor(cause: Error | ErrorWithCause, message?: string) {
    super({cause}, message);
  }

  public fullstack(): string {
    return VError.fullStack(this);
  }
}