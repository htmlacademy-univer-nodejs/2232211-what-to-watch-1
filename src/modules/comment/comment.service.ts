import { ICommentService } from './comment-service.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { IMovieService } from '../movie/movie-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { MAX_COMMENTS_COUNT } from './comment.constant.js';

@injectable()
export default class CommentService implements ICommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.IMovieService) private readonly movieService: IMovieService
  ) {}

  public async create(dto: CreateCommentDto, user: string): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({...dto, user});

    await this.movieService.updateRating(dto.movieId, dto.rating);
    await this.movieService.incCommentsCount(dto.movieId);

    return comment.populate('user');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    const movieComments = await this.commentModel.find({movieId}).sort({createdAt: -1}).limit(MAX_COMMENTS_COUNT);
    return this.commentModel.populate(movieComments, 'user');
  }
}
