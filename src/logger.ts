import { config } from './config';
import { createLogger } from "finnair-logger";
import { ErrorWithCause } from "./error/errorWithCause";

export class Logger {
  public static getInstance() {
    return Logger.instance || (Logger.instance = new Logger());
  }

  private static instance: Logger;
  private logger: any;

  public constructor() {
    // TODO: configure obfuscated properties based on environment
    this.logger = createLogger({ debug: config.debug, separator: " " });
  }

  public enable(): void {
    this.logger.setLog(true);
  }

  public disable(): void {
    this.logger.setLog(false);
  }

  public info(...fields: any[]) {
    this.logger.info("INFO:", ...this.getFieldsWithContext(fields));
  }

  public debug(...fields: any[]) {
    this.logger.debug("DEBUG:", ...this.getFieldsWithContext(fields));
  }

  public error(...fields: any[]) {
    this.logger.error("ERROR:", ...this.getFieldsWithContext(fields));
  }

  public log(level: string, ...fields: any[]) {
    switch (level) {
      case 'info':
        this.info(fields);
        break;
      case 'debug':
        this.debug(fields);
        break;
      case 'error':
        this.error(fields);
        break;
    }
  }

  private getFieldsWithContext(fields: any[]): any[] {
    let fieldsWithStacktrace = fields.reduce((extendedFields, field) => {
      if (field instanceof ErrorWithCause) {
        extendedFields.push("\n" + field.fullstack() + "\n");
      } else if (field instanceof Error) {
        extendedFields.push("\n" + field.stack + "\n");
      } else {
        extendedFields.push(field);
      }
      return extendedFields;
    }, []);
    return fieldsWithStacktrace;
  }

}

export const logger = Logger.getInstance();