import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controllers/controller.js';
import { COMPONENT } from '../../types/component.js';
import { LoggerInterface } from '../../common/loggers/logger.interface.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { PromoRoute } from './promo.route.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common-functions.js';
import MovieResponse from '../movie/response/movie.response.js';
import { MovieServiceInterface } from '../movie/movie-service.interface.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

@injectable()
export default class PromoController extends Controller {
  constructor(
    @inject(COMPONENT.LoggerInterface) log: LoggerInterface,
    @inject(COMPONENT.ConfigInterface) config: ConfigInterface,
    @inject(COMPONENT.MovieServiceInterface) private readonly movieService: MovieServiceInterface
  ) {
    super(log, config);

    this.log.info('Register routes for PromoController.');

    this.addRoute<PromoRoute>({path: PromoRoute.GetPromo, method: HttpMethod.Get, handler: this.show});
  }

  async show(_: Request, res: Response): Promise<void> {
    const result = this.movieService.findPromo();
    this.ok(res, fillDTO(MovieResponse, result));
  }
}
