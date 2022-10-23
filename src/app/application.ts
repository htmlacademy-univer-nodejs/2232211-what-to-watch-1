import { inject, injectable } from 'inversify';
import { Component } from '../types/component.js';
import { ILog } from '../common/loggers/logger.interface';
import { IConfig } from '../common/config/config.interface';
import { getDBConnectionURI } from '../utils/db.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.ILog) private logger: ILog,
    @inject(Component.IConfig) private config: IConfig
  ) {}

  async init() {
    this.logger.info('Application initialized.');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getDBConnectionURI(this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );
  }
}
