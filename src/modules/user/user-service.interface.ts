import { DocumentType } from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import { MovieEntity } from '../movie/movie.entity.js';
import LoginUserDto from './dto/login-user.dto.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  obtain(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findFavorite(userId: string): Promise<DocumentType<MovieEntity>[]>;
  addFavorite(movieId: string, userId: string): Promise<void | null>;
  deleteFavorite(movieId: string, userId: string): Promise<void | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
  setUserAvatarPath(userId: string, avatarPath: string): Promise<void | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
}
