import { Controller } from '../../common/controllers/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.js';
import { LoggerInterface } from '../../common/loggers/logger.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UserRoute } from './user.route.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { Request, Response } from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common-functions.js';
import UserResponse from './response/user.response.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import LoggedUserResponse from './response/logged-user.response.js';
import { createJWT } from '../../utils/crypto.js';
import { JWT_ALGORITHM } from './user.constant.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';

@injectable()
export default class UsersController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) log: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(log, config);

    this.log.info('Register routes for UsersController.');

    this.addRoute<UserRoute>({
      path: UserRoute.AddUser,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new UploadFileMiddleware(
          this.config.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
        new ValidateDtoMiddleware(CreateUserDto),
      ]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.Login,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ],
    });
    this.addRoute<UserRoute>({path: UserRoute.GetUser, method: HttpMethod.Get, handler: this.show});
    this.addRoute<UserRoute>({
      path: UserRoute.UploadAvatar,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
  }

  async create({body, file}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const isUserExists = await this.userService.findByEmail(body.email);

    if (isUserExists) {
      throw new HttpError(StatusCodes.CONFLICT, `User with that email '${body.email}' is already exists exists.`, 'UsersController');
    }

    const result = await this.userService.create(body, this.config.get('SALT'));

    const createdUser: UserResponse = result;

    if (file) {
      const avatarPath = file.filename;
      await this.userService.setUserAvatarPath(result.id, avatarPath);
      createdUser.avatarPath = avatarPath;
    }

    this.created(res, fillDTO(UserResponse, createdUser));
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

  async show(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, {...fillDTO(LoggedUserResponse, user), token: req.headers.authorization?.split(' ')[1]});
  }

  async uploadAvatar({file, params}: Request, res: Response) {
    const userId = params.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} doesn't exist`,
        'UsersController'
      );
    }

    if (file) {
      const avatarPath = file.filename;
      await this.userService.setUserAvatarPath(userId, avatarPath);
      this.created(res, fillDTO(UploadUserAvatarResponse, avatarPath));
    }
  }
}
