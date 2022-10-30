import { injectable, inject } from 'inversify';
import { IMovieService } from './movie-service.interface.js';
import { Component } from '../../types/component.js';
import { ILog} from '../../common/loggers/logger.interface.js';
import { types, DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.js';

@injectable()
export default class MovieService implements IMovieService {
  constructor(
    @inject(Component.ILog) private readonly log: ILog,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const movie = await this.movieModel.create(dto);
    this.log.info(`New movie created: ${dto.title}`);

    return movie;
  }

  async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).exec();
  }
}
