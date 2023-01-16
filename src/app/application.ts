import { inject, injectable } from 'inversify';
import { COMPONENT } from '../types/component.js';
import { LoggerInterface } from '../common/loggers/logger.interface';
import { ConfigInterface } from '../common/config/config.interface';
import { getDBConnectionURIFromConfig } from '../utils/db.js';
import { DatabaseInterface } from '../common/db-client/database.interface.js';
import express, { Express } from 'express';
import { IController } from '../common/controllers/controller.interface.js';
import { ExceptionFilterInterface } from '../common/filters/exception-filter/exception-filter.interface.js';
import { AuthenticateMiddleware } from '../common/middlewares/authenticate.middleware.js';
import { getFullServerPath } from '../utils/common-functions.js';
import cors from 'cors';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(COMPONENT.LoggerInterface) private logger: LoggerInterface,
    @inject(COMPONENT.ConfigInterface) private config: ConfigInterface,
    @inject(COMPONENT.DatabaseInterface) private dbClient: DatabaseInterface,
    @inject(COMPONENT.FavoriteController) private favoriteController: IController,
    @inject(COMPONENT.PromoController) private promoController: IController,
    @inject(COMPONENT.UsersController) private usersController: IController,
    @inject(COMPONENT.MovieController) private movieController: IController,
    @inject(COMPONENT.CommentController) private commentController: IController,
    @inject(COMPONENT.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
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
    this.expressApp.use(cors());
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

    const host = this.config.get('HOST');
    const port = this.config.get('PORT');
    this.expressApp.listen(port, () => {
      this.logger.info(`Server started on ${getFullServerPath(host, port)}`);
    });
  }
}
