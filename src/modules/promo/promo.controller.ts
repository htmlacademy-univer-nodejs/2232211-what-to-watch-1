import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controllers/controller.js';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { PromoRoute } from './promo.route.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common-functions.js';
import MovieResponse from '../movie/response/movie.response.js';
import { IMovieService } from '../movie/movie-service.interface.js';

@injectable()
export default class PromoController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IMovieService) private readonly movieService: IMovieService
  ) {
    super(log);

    this.log.info('Register routes for PromoController.');

    this.addRoute<PromoRoute>({path: PromoRoute.GET_PROMO, method: HttpMethod.Get, handler: this.show});
  }

  async show(_: Request, res: Response): Promise<void> {
    const result = this.movieService.findPromo();
    this.ok(res, fillDTO(MovieResponse, result));
  }
}
