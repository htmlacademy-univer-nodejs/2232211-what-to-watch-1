import { inject, injectable } from 'inversify';
import { Component } from '../types/component.js';
import { ILog } from '../common/loggers/logger.interface';
import { IConfig } from '../common/config/config.interface';
import { getDBConnectionURIFromConfig } from '../utils/db.js';
import { IDatabase } from '../common/db-client/database.interface.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.ILog) private logger: ILog,
    @inject(Component.IConfig) private config: IConfig,
    @inject(Component.IDatabase) private dbClient: IDatabase
  ) {}

  async init() {
    this.logger.info('Application initialized.');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getDBConnectionURIFromConfig(this.config);

    await this.dbClient.connect(uri);
  }
}
