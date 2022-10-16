import { ILog } from './logger.interface';
import pino, { Logger } from 'pino';
import { injectable } from 'inversify';

@injectable()
export default class PinoLogger implements ILog {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino();
    this.logger.info('Pino logger created successfully.');
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }
}
