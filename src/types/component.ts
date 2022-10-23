export const Component = {
  Application: Symbol.for('Application'),
  ILog: Symbol.for('ILog'),
  IConfig: Symbol.for('IConfig'),
  IDatabase: Symbol.for('IDatabase'),
  IUserService: Symbol.for('IUserService'),

  UserModel: Symbol.for('UserModel'),
} as const;
