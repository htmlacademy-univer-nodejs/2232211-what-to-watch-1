import { Controller } from '../../common/controllers/controller.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { inject } from 'inversify';
import { Component } from '../../types/component.js';
import { ICommentService } from './comment-service.interface.js';
import { IMovieService } from '../movie/movie-service.interface.js';
import { CommentRoute } from './comment.route.js';
import { HttpMethod } from '../../common/controllers/http-method.enum.js';
import { Request, Response } from 'express';
import CreateCommentDto from './dto/create-comment.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common-functions.js';
import CommentResponse from './response/comment.response.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { IConfig } from '../../common/config/config.interface.js';

export default class CommentController extends Controller {
  constructor(
    @inject(Component.ILog) log: ILog,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.ICommentService) private readonly commentService: ICommentService,
    @inject(Component.IMovieService) private readonly movieService: IMovieService,
  ) {
    super(log, config);

    this.log.info('Register routes for CommentController.');

    this.addRoute<CommentRoute>({
      path: CommentRoute.ADD_COMMENT,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
      ],
    });
  }

  public async create({body, user}: Request<object, object, CreateCommentDto>, res: Response): Promise<void> {
    if (!await this.movieService.exists(body.movieId)) {
      throw new HttpError(StatusCodes.NOT_FOUND,`Movie with id ${body.movieId} not found.`,'CommentController');
    }

    const comment = await this.commentService.create({...body, userId: user.id});
    await this.movieService.incCommentsCount(body.movieId);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
