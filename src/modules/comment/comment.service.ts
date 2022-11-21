import { ICommentService } from './comment-service.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { IMovieService } from '../movie/movie-service.interface.js';
import CreateCommentDto from './dto/create-comment.js';

@injectable()
export default class CommentService implements ICommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.IMovieService) private readonly movieService: IMovieService
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    await this.movieService.updateRating(dto.movieId, dto.rating);
    await this.movieService.incCommentsCount(dto.movieId);

    return comment.populate('userId');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ movieId }).populate('userId');
  }
}
