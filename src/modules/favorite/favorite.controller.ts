import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controllers/controller.js';
import { COMPONENT } from '../../types/component.js';
import { LoggerInterface } from '../../common/loggers/logger.interface.js';
import { FavoriteRoute } from './favorite.route.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common-functions.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import MovieResponse from '../movie/response/movie.response.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { MovieServiceInterface } from '../movie/movie-service.interface.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(COMPONENT.LoggerInterface) log: LoggerInterface,
    @inject(COMPONENT.ConfigInterface) config: ConfigInterface,
    @inject(COMPONENT.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(COMPONENT.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(log, config);

    this.log.info('Register routes for FavoriteController.');

    this.addRoute<FavoriteRoute>({
      path: FavoriteRoute.GetFavorite,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute<FavoriteRoute>({
      path: FavoriteRoute.AddFavorite,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]
    });
    this.addRoute<FavoriteRoute>({
      path: FavoriteRoute.DeleteFavorite,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]
    });
  }

  async show({user}: Request<Record<string, unknown>, Record<string, unknown>>, res: Response): Promise<void> {
    const result = await this.userService.findFavorite(user.id);
    this.ok(res, fillDTO(MovieResponse, result));
  }

  async create({body, user}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string}>, res: Response): Promise<void> {
    await this.userService.addFavorite(user.id, body.movieId);
    this.created(res, {message: 'Success. Add movie to favorite\'s list.'});
  }

  async delete({body, user}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string}>, res: Response): Promise<void> {
    await this.userService.deleteFavorite(user.id, body.movieId);
    this.noContent(res, {message: 'Success. Delete movie from favorite\'s list.'});
  }
}
