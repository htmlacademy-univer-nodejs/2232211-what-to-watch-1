import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controllers/controller.js';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { MovieRoute } from './movie.route.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common-functions.js';
import MovieResponse from './response/movie.response.js';
import CreateMovieDto from './dto/create-movie.js';
import { IMovieService } from './movie-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import UpdateMovieDto from './dto/update-movie.js';
import { ICommentService } from '../comment/comment-service.interface.js';
import * as staticCore from 'express-serve-static-core';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';

type ParamsGetMovie = {
  movieId: string;
}

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IMovieService) private readonly movieService: IMovieService,
    @inject(Component.ICommentService) private readonly commentService: ICommentService,
  ) {
    super(log);

    this.log.info('Register routes for MovieController.');

    this.addRoute<MovieRoute>({
      path: MovieRoute.ADD_MOVIE,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateMovieDto),
      ],
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.GET_MOVIE,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute<MovieRoute>({ path: MovieRoute.GET_MOVIES, method: HttpMethod.Get, handler: this.index });
    this.addRoute<MovieRoute>({
      path: MovieRoute.UPDATE_MOVIE,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(UpdateMovieDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.DELETE_MOVIE,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.GET_COMMENTS,
      method: HttpMethod.Get,
      handler: this.indexComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
  }

  async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const result = await this.movieService.create(body);

    this.created(res, fillDTO(MovieResponse, result));
  }

  async show({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(`${params.movieId}`);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id '${params.movieId}' was not found`, 'MovieController');
    }

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  async index(_req: Request, res: Response): Promise<void> {
    const movies = await this.movieService.find();

    this.ok(res, fillDTO(MovieResponse, movies));
  }

  async update({params, body}: Request<Record<string, string>, Record<string, unknown>, UpdateMovieDto>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id '${params.movieId}' was not found`, 'MovieController');
    }

    const result = await this.movieService.updateById(params.movieId, body);

    this.ok(res, fillDTO(MovieResponse, result));
  }

  async delete({params}: Request<Record<string, string>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(`${params.movieId}`);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id '${params.movieId}' was not found`, 'MovieController');
    }

    await this.movieService.deleteById(`${params.movieId}`);

    this.noContent(res, {message: 'The movie successfully deleted'});
  }

  async indexComments({params}: Request<staticCore.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const comments = await this.commentService.findByMovieId(params.movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
