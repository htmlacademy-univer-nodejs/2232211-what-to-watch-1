import {NextFunction, Request, Response} from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import HttpError from '../../errors/http-error.js';
import { createErrorObject } from '../../../utils/common-functions.js';
import { LoggerInterface } from '../../loggers/logger.interface.js';
import { Component } from '../../../types/component.js';
import { ServiceError } from '../../../types/service-error.enum.js';
import ValidationError from '../../errors/validation-error.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(Component.LoggerInterface) private log: LoggerInterface) {
    this.log.info('Register ExceptionFilter');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.log.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(ServiceError.CommonError, error.message));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.log.error(`ERROR: ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(ServiceError.ServiceError, error.message));
  }

  public catch(error: Error | HttpError | ValidationError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleValidationError(error: ValidationError, _req: Request, res: Response, _next: NextFunction) {
    this.log.error(`[Validation Error]: ${error.message}`);
    error.details.forEach(
      (errorField) => this.log.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }
}
