import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import HttpError from '../errors/http-error.js';
import { IMiddleware } from './middleware.interface.js';

export class PrivateRouteMiddleware implements IMiddleware {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
