import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: CreateCommentDto, user: string): Promise<DocumentType<CommentEntity>>;
}
