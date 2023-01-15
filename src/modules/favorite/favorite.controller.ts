import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controllers/controller.js';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { FavoriteRoute } from './favorite.route.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common-functions.js';
import { IUserService } from '../user/user-service.interface.js';
import MovieResponse from '../movie/response/movie.response.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { IConfig } from '../../common/config/config.interface.js';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.IUserService) private readonly userService: IUserService,
  ) {
    super(log, config);

    this.log.info('Register routes for FavoriteController.');

    this.addRoute<FavoriteRoute>({
      path: FavoriteRoute.GET_FAVORITE,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute<FavoriteRoute>({
      path: FavoriteRoute.ADD_FAVORITE,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute<FavoriteRoute>({
      path: FavoriteRoute.DELETE_FAVORITE,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
  }

  async show({user}: Request<Record<string, unknown>, Record<string, unknown>>, res: Response): Promise<void> {
    const result = this.userService.findFavorite(user.id);
    this.ok(res, fillDTO(MovieResponse, result));
  }

  async create({body, user}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string}>, res: Response): Promise<void> {
    await this.userService.addFavorite(body.movieId, user.id);
    this.created(res, {message: 'Success. Add movie to favorite\'s list.'});
  }

  async delete({body, user}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string}>, res: Response): Promise<void> {
    await this.userService.deleteFavorite(body.movieId, user.id);
    this.noContent(res, {message: 'Success. Delete movie from favorite\'s list.'});
  }
}
