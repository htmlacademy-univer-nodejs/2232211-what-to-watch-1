export const COMPONENT = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  MovieServiceInterface: Symbol.for('MovieServiceInterface'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface'),

  UserModel: Symbol.for('UserModel'),
  MovieModel: Symbol.for('MovieModel'),
  CommentModel: Symbol.for('CommentModel'),

  UsersController: Symbol.for('UsersController'),
  MovieController: Symbol.for('MovieController'),
  FavoriteController: Symbol.for('FavoriteController'),
  PromoController: Symbol.for('PromoController'),
  CommentController: Symbol.for('CommentController'),
} as const;
