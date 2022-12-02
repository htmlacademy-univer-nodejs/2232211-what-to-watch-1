import { Controller } from '../../common/controllers/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { IUserService } from './user-service.interface.js';
import { IConfig } from '../../common/config/config.interface.js';
import { UserRoute } from './user.route.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { Request, Response } from 'express';
import CreateUserDto from './dto/create-user.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common-functions.js';
import UserResponse from './response/user.response.js';
import LoginUserDto from './dto/login-user.js';

@injectable()
export default class UsersController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IUserService) private readonly userService: IUserService,
    @inject(Component.IConfig) private readonly config: IConfig,
  ) {
    super(log);

    this.log.info('Register routes for UsersController.');

    this.addRoute<UserRoute>({path: UserRoute.ADD_USER, method: HttpMethod.Post, handler: this.addUser});
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Post, handler: this.login});
    this.addRoute<UserRoute>({path: UserRoute.GET_USER, method: HttpMethod.Get, handler: this.getUser});
    this.addRoute<UserRoute>({path: UserRoute.LOGOUT, method: HttpMethod.Delete, handler: this.logout});
  }

  async addUser({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const isUserExists = await this.userService.findByEmail(body.email);

    if (isUserExists) {
      throw new HttpError(StatusCodes.CONFLICT, `User with that email '${body.email}' is already exists exists.`, 'UsersController');
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserResponse, result));
  }

  async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Incorrect login or password', 'UserController');
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async getUser(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async logout(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }
}
