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
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import LoggedUserResponse from './response/logged-user.response.js';
import { createJWT } from '../../utils/crypto.js';
import { JWT_ALGORITHM } from './user.constant.js';

@injectable()
export default class UsersController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.IUserService) private readonly userService: IUserService,
  ) {
    super(log, config);

    this.log.info('Register routes for UsersController.');

    this.addRoute<UserRoute>({
      path: UserRoute.ADD_USER,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
      ]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ],
    });
    this.addRoute<UserRoute>({path: UserRoute.GET_USER, method: HttpMethod.Get, handler: this.show});
    this.addRoute<UserRoute>({path: UserRoute.LOGOUT, method: HttpMethod.Delete, handler: this.logout});
    this.addRoute<UserRoute>({
      path: UserRoute.UPLOAD_AVATAR,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Get,
      handler: this.checkAuthenticate
    });
  }

  async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const isUserExists = await this.userService.findByEmail(body.email);

    if (isUserExists) {
      throw new HttpError(StatusCodes.CONFLICT, `User with that email '${body.email}' is already exists exists.`, 'UsersController');
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserResponse, result));
  }

  async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.config.get('SALT'));

    if (!user) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Unauthorized', 'UserController');
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.config.get('JWT_SECRET'),
      { email: user.email, id: user.id}
    );

    this.ok(res, fillDTO(LoggedUserResponse, {email: user.email, token}));
  }

  async show(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async logout(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  async checkAuthenticate(req: Request, res: Response) {
    const user = await this.userService.findByEmail(req.user.email);

    this.ok(res, fillDTO(LoggedUserResponse, user));
  }
}
