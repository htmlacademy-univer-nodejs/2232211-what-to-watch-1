import CreateMovieDto from './dto/create-movie.js';
import { DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import UpdateMovieDto from './dto/update-movie.js';

export interface IMovieService {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(): Promise<DocumentType<MovieEntity>[]>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<void | null>;
  findByGenre(genre: string, limit?: number): Promise<DocumentType<MovieEntity>[]>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  incCommentsCount(movieId: string): Promise<void | null>;
  updateRating(movieId: string, rating: number): Promise<void | null>;
  exists(documentId: string): Promise<boolean>;
}
