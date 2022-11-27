import { IController } from './controller.interface.js';
import { Response, Router } from 'express';
import { ILog } from '../loggers/logger.interface.js';
import { IRoute } from './route.interface.js';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';


@injectable()
export abstract class Controller implements IController {
  private readonly _router: Router;

  constructor(protected readonly log: ILog) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute<T extends string>(route: IRoute<T>) {
    this._router[route.method](route.path, asyncHandler(route.handler.bind(this)));
    this.log.info(`New route: ${route.method.toUpperCase()}: ${route.path}`);
  }

  send<T>(res: Response, statusCode: number, data: T): void {
    res.type('application/json')
      .status(statusCode)
      .json(data);
  }

  ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }
}
