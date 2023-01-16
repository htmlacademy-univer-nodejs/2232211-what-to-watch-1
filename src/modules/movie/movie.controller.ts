import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controllers/controller.js';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { MovieRoute } from './movie.route.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common-functions.js';
import MovieResponse from './response/movie.response.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { IMovieService } from './movie-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { ICommentService } from '../comment/comment-service.interface.js';
import * as staticCore from 'express-serve-static-core';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { IConfig } from '../../common/config/config.interface.js';
import { getRandomItem } from '../../utils/random.js';
import { DEFAULT_MOVIE_BACKGROUND_IMAGES, DEFAULT_MOVIE_POSTER_IMAGES } from './movie.constants.js';
import { Genre, toGenre } from '../../models/genre.js';
import { DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';

type ParamsGetMovie = {
  movieId: string;
}

type IndexMoviesQuery = {
  limit?: string;
  genre?: Genre;
};

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.IMovieService) private readonly movieService: IMovieService,
    @inject(Component.ICommentService) private readonly commentService: ICommentService,
  ) {
    super(log, config);

    this.log.info('Register routes for MovieController.');

    this.addRoute<MovieRoute>({
      path: MovieRoute.AddMovie,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateMovieDto),
      ],
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.GetMovie,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute<MovieRoute>({ path: MovieRoute.GetMovies, method: HttpMethod.Get, handler: this.index });
    this.addRoute<MovieRoute>({
      path: MovieRoute.UpdateMovie,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(UpdateMovieDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.DeleteMovie,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute<MovieRoute>({
      path: MovieRoute.GetComments,
      method: HttpMethod.Get,
      handler: this.indexComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
  }

  async create({body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const randomPosterPath = getRandomItem(DEFAULT_MOVIE_POSTER_IMAGES);
    const randomBackgroundImagePath = getRandomItem(DEFAULT_MOVIE_BACKGROUND_IMAGES);
    const result = await this.movieService.create({
      ...body,
      posterPath: randomPosterPath,
      backgroundImagePath: randomBackgroundImagePath,
    }, user.id);
    this.created(res, fillDTO(MovieResponse, result));
  }

  async show({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(`${params.movieId}`);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id '${params.movieId}' was not found`, 'MovieController');
    }

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  async index({query}: Request<unknown, unknown, unknown, IndexMoviesQuery>, res: Response): Promise<void> {
    const genre = query.genre;
    const limit = query.limit ? parseInt(query.limit, 10) : undefined;
    let movies: DocumentType<MovieEntity>[];
    if (genre) {
      movies = await this.movieService.findByGenre(toGenre(genre), limit);
    } else {
      movies = await this.movieService.find(limit);
    }
    this.ok(res, fillDTO(MovieResponse, movies));
  }

  async update({params, body, user}: Request<Record<string, string>, Record<string, unknown>, UpdateMovieDto>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);

    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id '${params.movieId}' was not found`,
        'MovieController');
    }

    if (movie.user?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${user.id} doesn't have permission to update movie`,
        'MovieController');
    }

    const randomPosterPath = getRandomItem(DEFAULT_MOVIE_POSTER_IMAGES);
    const randomBackgroundImagePath = getRandomItem(DEFAULT_MOVIE_BACKGROUND_IMAGES);
    const result = await this.movieService.updateById(params.movieId, {
      ...body,
      posterPath: randomPosterPath,
      backgroundImagePath: randomBackgroundImagePath
    });

    this.ok(res, fillDTO(MovieResponse, result));
  }

  async delete({params, user}: Request<Record<string, string>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(`${params.movieId}`);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id '${params.movieId}' was not found`, 'MovieController');
    }

    if (movie.user?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${user.id} doesn't have permission to delete movie`,
        'MovieController');
    }

    await this.movieService.deleteById(`${params.movieId}`);

    this.noContent(res, {message: 'The movie successfully deleted'});
  }

  async indexComments({params}: Request<staticCore.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const comments = await this.commentService.findByMovieId(params.movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
