import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { DatabaseInterface } from './database.interface.js';
import { Component } from '../../types/component.js';
import { LoggerInterface } from '../loggers/logger.interface';

@injectable()
export default class MongoDBService implements DatabaseInterface {
  constructor(
    @inject(Component.LoggerInterface) private log: LoggerInterface,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.log.info('Try to connect to MongoDB…');
    await mongoose.connect(uri);
    this.log.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.log.info('Database connection closed.');
  }
}
