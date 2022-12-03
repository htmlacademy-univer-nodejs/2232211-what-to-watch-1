import { injectable, inject } from 'inversify';
import { IMovieService } from './movie-service.interface.js';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { types, DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.js';
import { MAX_MOVIES_COUNT } from './movie.constants.js';
import UpdateMovieDto from './dto/update-movie.js';

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
    return this.movieModel.findById(movieId).populate('userId');
  }

  async find(): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: { movieId: '$_id' },
          pipeline: [
            { $match: { $expr: { $in: ['$$movieId', '$movies'] } } },
            { $project: { _id: 1 } }
          ],
          as: 'comments'
        },
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentsCount: { $size: '$comments' },
          rating: { $avg: '$comments.rating' }
        }
      },
      { $unset: 'comments' },
      { $limit: MAX_MOVIES_COUNT }
    ]);
  }

  async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(movieId, dto).populate('userId');
  }

  async deleteById(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndDelete(movieId);
  }

  async findByGenre(genre: string, limit?: number): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel.find({ genre }, {}, { limit }).populate('userId');
  }

  async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({ isPromo: true }).populate('userId');
  }

  async incCommentsCount(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndUpdate(movieId, { $inc: { commentsCount: 1 } });
  }

  async updateRating(movieId: string, rating: number): Promise<void | null> {
    const oldValues = await this.movieModel.findById(movieId).select('rating commentsCount');
    const oldRating = oldValues?.['rating'] ?? 0;
    const oldCommentsCount = oldValues?.['commentsCount'] ?? 0;

    return this.movieModel.findByIdAndUpdate(movieId, {
      rating: (oldRating * oldCommentsCount + rating) / (oldCommentsCount + 1)
    });
  }

  async exists(documentId: string): Promise<boolean> {
    return (this.movieModel.exists({_id: documentId})) !== null;
  }
}
