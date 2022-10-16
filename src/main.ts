import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './types/component.js';
import ConfigService from './common/config/config.service.js';
import Application from './app/application.js';
import { ILog } from './common/loggers/logger.interface';
import { IConfig } from './common/config/config.interface';
import PinoLogger from './common/loggers/logger-pino.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ILog>(Component.ILog).to(PinoLogger).inSingletonScope();
applicationContainer.bind<IConfig>(Component.IConfig).to(ConfigService).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
