import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './types/component.js';
import ConfigService from './common/config/config.service.js';
import Application from './app/application.js';
import { LoggerInterface } from './common/loggers/logger.interface';
import { ConfigInterface } from './common/config/config.interface';
import PinoLogger from './common/loggers/logger-pino.js';
import { DatabaseInterface } from './common/db-client/database.interface.js';
import MongoDBService from './common/db-client/mongodb.service.js';
import { UserServiceInterface } from './modules/user/user-service.interface.js';
import UserService from './modules/user/user.service.js';
import { UserEntity, UserModel } from './modules/user/user.entity.js';
import { types } from '@typegoose/typegoose';
import { MovieServiceInterface } from './modules/movie/movie-service.interface.js';
import MovieService from './modules/movie/movie.service.js';
import { MovieEntity, MovieModel } from './modules/movie/movie.entity.js';
import { CommentServiceInterface } from './modules/comment/comment-service.interface.js';
import CommentService from './modules/comment/comment.service.js';
import { CommentEntity, CommentModel } from './modules/comment/comment.entity.js';
import { IController } from './common/controllers/controller.interface.js';
import FavoriteController from './modules/favorite/favorite.controller.js';
import PromoController from './modules/promo/promo.controller.js';
import UsersController from './modules/user/users.controller.js';
import MovieController from './modules/movie/movie.controller.js';
import { ExceptionFilterInterface } from './common/filters/exception-filter/exception-filter.interface.js';
import ExceptionFilter from './common/filters/exception-filter/exception-filter.js';
import CommentController from './modules/comment/comment.controller.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(PinoLogger).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(MongoDBService).inSingletonScope();
applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
applicationContainer.bind<MovieServiceInterface>(Component.MovieServiceInterface).to(MovieService);
applicationContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);

applicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
applicationContainer.bind<types.ModelType<MovieEntity>>(Component.MovieModel).toConstantValue(MovieModel);
applicationContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

applicationContainer.bind<IController>(Component.FavoriteController).to(FavoriteController).inSingletonScope();
applicationContainer.bind<IController>(Component.PromoController).to(PromoController).inSingletonScope();
applicationContainer.bind<IController>(Component.UsersController).to(UsersController).inSingletonScope();
applicationContainer.bind<IController>(Component.MovieController).to(MovieController).inSingletonScope();
applicationContainer.bind<IController>(Component.CommentController).to(CommentController).inSingletonScope();

applicationContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
