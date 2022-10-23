import CreateMovieDto from './dto/create-movie.js';
import { DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';

export interface IMovieService {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
}
