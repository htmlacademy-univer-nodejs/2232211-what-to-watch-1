import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { IExceptionFilter } from './exception-filter.interface.js';
import HttpError from '../../errors/http-error.js';
import { createErrorObject } from '../../../utils/common-functions.js';
import { ILog } from '../../loggers/logger.interface.js';
import { Component } from '../../../types/component.js';

@injectable()
export default class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(Component.ILog) private log: ILog) {
    this.log.info('Register ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response) {
    this.log.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response) {
    this.log.error(`ERROR: ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(error.message));
  }

  public catch(error: Error | HttpError, req: Request, res: Response): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res);
    }

    this.handleOtherError(error, req, res);
  }
}
