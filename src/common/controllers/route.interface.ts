import { HttpMethod } from './http-method.enum.js';
import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../middlewares/middleware.interface.js';

export interface IRoute<Path extends string> {
  path: Path;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
