import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { IConfig } from './config.interface.js';
import { configSchema, ConfigSchema } from './config.schema.js';
import { Component } from '../../types/component.js';
import { ILog } from '../loggers/logger.interface';

@injectable()
export default class ConfigService implements IConfig {
  private readonly config: ConfigSchema;
  private logger: ILog;

  constructor(@inject(Component.ILog) logger: ILog) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}
