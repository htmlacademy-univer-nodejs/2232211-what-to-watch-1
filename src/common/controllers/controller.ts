import { IController } from './controller.interface.js';
import { Response, Router } from 'express';
import { LoggerInterface } from '../loggers/logger.interface.js';
import { IRoute } from './route.interface.js';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { ConfigInterface } from '../config/config.interface.js';
import { UnknownObject } from '../../types/unknown-object.type.js';
import { getFullServerPath, transformObject } from '../../utils/common-functions.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/application.constant.js';


@injectable()
export abstract class Controller implements IController {
  private readonly _router: Router;

  constructor(
    protected readonly log: LoggerInterface,
    protected readonly config: ConfigInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute<T extends string>(route: IRoute<T>) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);

    this.log.info(`New route: ${route.method.toUpperCase()}: ${route.path}`);
  }

  protected addStaticPath(data: UnknownObject): void {
    const fullServerPath = getFullServerPath(this.config.get('HOST'), this.config.get('PORT'));
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.config.get('STATIC_DIRECTORY_PATH')}`,
      `${fullServerPath}/${this.config.get('UPLOAD_DIRECTORY')}`,
      data
    );
  }

  send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownObject);
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
