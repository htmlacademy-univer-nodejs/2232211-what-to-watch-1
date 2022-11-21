import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.js';

export interface ICommentService {
  findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
}
