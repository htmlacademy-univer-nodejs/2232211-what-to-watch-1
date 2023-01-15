import { inject, injectable } from 'inversify';
import { IUserService } from './user-service.interface.js';
import { Component } from '../../types/component.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import { UserEntity } from './user.entity.js';
import CreateUserDto from './dto/create-user.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { MovieEntity } from '../movie/movie.entity';
import LoginUserDto from './dto/login-user.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(Component.ILog) private readonly log: ILog,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.log.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async obtain(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  async findFavorite(userId: string): Promise<DocumentType<MovieEntity>[]> {
    const favoriteMovies = await this.userModel.findById(userId).select('favoriteMovies');
    return this.movieModel.find({ _id: { $in: favoriteMovies } });
  }

  async addFavorite(userId: string, movieId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: { favoriteMovies: movieId }
    });
  }

  async deleteFavorite(userId: string, movieId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { favoriteMovies: movieId }
    });
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (user && user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }
}
