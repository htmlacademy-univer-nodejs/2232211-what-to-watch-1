export const Component = {
  Application: Symbol.for('Application'),
  ILog: Symbol.for('ILog'),
  IConfig: Symbol.for('IConfig'),
  IDatabase: Symbol.for('IDatabase'),
  IUserService: Symbol.for('IUserService'),
  IMovieService: Symbol.for('IMovieService'),
  ICommentService: Symbol.for('ICommentService'),
  IExceptionFilter: Symbol.for('IExceptionFilter'),

  UserModel: Symbol.for('UserModel'),
  MovieModel: Symbol.for('MovieModel'),
  CommentModel: Symbol.for('CommentModel'),

  UsersController: Symbol.for('UsersController'),
  MovieController: Symbol.for('MovieController'),
  FavoriteController: Symbol.for('FavoriteController'),
  PromoController: Symbol.for('PromoController'),
  CommentController: Symbol.for('CommentController'),
} as const;
