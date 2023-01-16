import CreateMovieDto from './dto/create-movie.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { IDocumentExistsService } from '../../types/document-exists-service.interface.js';

export interface IMovieService extends IDocumentExistsService {
  create(dto: CreateMovieDto, userId: string): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(limit?: number): Promise<DocumentType<MovieEntity>[]>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<void | null>;
  findByGenre(genre: string, limit?: number): Promise<DocumentType<MovieEntity>[]>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  incCommentsCount(movieId: string): Promise<void | null>;
  updateRating(movieId: string, rating: number): Promise<void | null>;
  exists(documentId: string): Promise<boolean>;
}
