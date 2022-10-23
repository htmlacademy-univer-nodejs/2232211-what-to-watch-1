import { IConfig } from '../common/config/config.interface.js';

export function getDBConnectionURI(
  username: string,
  password: string,
  host: string,
  port: number,
  dbName: string): string {
  return `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
}

export function getDBConnectionURIFromConfig(config: IConfig) {
  return getDBConnectionURI(config.get('DB_USER'),
    config.get('DB_PASSWORD'),
    config.get('DB_HOST'),
    config.get('DB_PORT'),
    config.get('DB_NAME')
  );
}
