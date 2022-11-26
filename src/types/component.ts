export const Component = {
  Application: Symbol.for('Application'),
  ILog: Symbol.for('ILog'),
  IConfig: Symbol.for('IConfig'),
  IDatabase: Symbol.for('IDatabase'),
  IUserService: Symbol.for('IUserService'),
  IMovieService: Symbol.for('IMovieService'),
  ICommentService: Symbol.for('ICommentService'),

  UserModel: Symbol.for('UserModel'),
  MovieModel: Symbol.for('MovieModel'),
  CommentModel: Symbol.for('CommentModel'),
} as const;
