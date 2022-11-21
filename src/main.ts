import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './types/component.js';
import ConfigService from './common/config/config.service.js';
import Application from './app/application.js';
import { ILog } from './common/loggers/logger.interface';
import { IConfig } from './common/config/config.interface';
import PinoLogger from './common/loggers/logger-pino.js';
import { IDatabase } from './common/db-client/database.interface.js';
import MongoDBService from './common/db-client/mongodb.service.js';
import { IUserService } from './modules/user/user-service.interface.js';
import UserService from './modules/user/user.service.js';
import { UserEntity, UserModel } from './modules/user/user.entity.js';
import { types } from '@typegoose/typegoose';
import { IMovieService } from './modules/movie/movie-service.interface.js';
import MovieService from './modules/movie/movie.service.js';
import { MovieEntity, MovieModel } from './modules/movie/movie.entity.js';
import { ICommentService } from './modules/comment/comment-service.interface.js';
import CommentService from './modules/comment/comment.service.js';
import { CommentEntity, CommentModel } from './modules/comment/comment.entity.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ILog>(Component.ILog).to(PinoLogger).inSingletonScope();
applicationContainer.bind<IConfig>(Component.IConfig).to(ConfigService).inSingletonScope();
applicationContainer.bind<IDatabase>(Component.IDatabase).to(MongoDBService).inSingletonScope();
applicationContainer.bind<IUserService>(Component.IUserService).to(UserService);
applicationContainer.bind<IMovieService>(Component.IMovieService).to(MovieService);
applicationContainer.bind<ICommentService>(Component.ICommentService).to(CommentService);

applicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
applicationContainer.bind<types.ModelType<MovieEntity>>(Component.MovieModel).toConstantValue(MovieModel);
applicationContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
