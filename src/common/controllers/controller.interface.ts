import { Response, Router } from 'express';
import { IRoute } from './route.interface.js';

export interface IController {
  readonly router: Router;
  addRoute<T extends string>(route: IRoute<T>): void;
  send<T>(res: Response, statusCode: number, data: T): void;
  ok<T>(res: Response, data: T): void;
  created<T>(res: Response, data: T): void;
  noContent<T>(res: Response, data: T): void;
}
