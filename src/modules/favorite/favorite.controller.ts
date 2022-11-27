import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controllers/controller.js';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { FavoriteRoutes } from './favorite.routes.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common-functions.js';
import { IUserService } from '../user/user-service.interface.js';
import MovieResponse from '../movie/response/movie.response.js';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IUserService) private readonly userService: IUserService,
  ) {
    super(log);

    this.log.info('Register routes for FavoriteController.');

    this.addRoute<FavoriteRoutes>({ path: FavoriteRoutes.GET_FAVORITE, method: HttpMethod.Get, handler: this.getFavorite });
    this.addRoute<FavoriteRoutes>({ path: FavoriteRoutes.ADD_FAVORITE, method: HttpMethod.Post, handler: this.addFavorite });
    this.addRoute<FavoriteRoutes>({ path: FavoriteRoutes.DELETE_FAVORITE, method: HttpMethod.Delete, handler: this.deleteFavorite });
  }

  async getFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = this.userService.findFavorite(body.userId);
    this.ok(_res, fillDTO(MovieResponse, result));
  }

  async addFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.addFavorite(body.movieId, body.userId);
    this.created(_res, {message: 'Success. Add movie to favorite\'s list.'});
  }

  async deleteFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.deleteFavorite(body.movieId, body.userId);
    this.noContent(_res, {message: 'Success. Delete movie from favorite\'s list.'});
  }
}
