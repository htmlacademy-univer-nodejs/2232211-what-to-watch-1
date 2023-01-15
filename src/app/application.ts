import { inject, injectable } from 'inversify';
import { Component } from '../types/component.js';
import { ILog } from '../common/loggers/logger.interface';
import { IConfig } from '../common/config/config.interface';
import { getDBConnectionURIFromConfig } from '../utils/db.js';
import { IDatabase } from '../common/db-client/database.interface.js';
import express, { Express } from 'express';
import { IController } from '../common/controllers/controller.interface.js';
import { IExceptionFilter } from '../common/filters/exception-filter/exception-filter.interface.js';
import { AuthenticateMiddleware } from '../common/middlewares/authenticate.middleware.js';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.ILog) private logger: ILog,
    @inject(Component.IConfig) private config: IConfig,
    @inject(Component.IDatabase) private dbClient: IDatabase,
    @inject(Component.FavoriteController) private favoriteController: IController,
    @inject(Component.PromoController) private promoController: IController,
    @inject(Component.UsersController) private usersController: IController,
    @inject(Component.MovieController) private movieController: IController,
    @inject(Component.CommentController) private commentController: IController,
    @inject(Component.IExceptionFilter) private exceptionFilter: IExceptionFilter,
  ) {
    this.expressApp = express();
  }

  initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.expressApp.use(
      '/static',
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );

    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  initRoutes() {
    this.expressApp.use('/favorite', this.favoriteController.router);
    this.expressApp.use('/promo', this.promoController.router);
    this.expressApp.use('/users', this.usersController.router);
    this.expressApp.use('/movies', this.movieController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init() {
    this.logger.info('Application initialized.');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getDBConnectionURIFromConfig(this.config);

    await this.dbClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();

    const port = this.config.get('PORT');
    this.expressApp.listen(port, () => {
      this.logger.info(`Server started on http://localhost:${port}`);
    });
  }
}
