import { IConfig } from '../common/config/config.interface.js';

export interface DBConnectionUriData {
  username: string;
  password: string;
  host: string;
  port: number;
  dbName: string;
}

export function getDBConnectionURI({username, password, host, port, dbName}: DBConnectionUriData): string {
  return `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
}

export function getDBConnectionURIFromConfig(config: IConfig) {
  const connectionData = {
    username: config.get('DB_USER'),
    password: config.get('DB_PASSWORD'),
    host: config.get('DB_HOST'),
    port: config.get('DB_PORT'),
    dbName: config.get('DB_NAME')
  };

  return getDBConnectionURI(connectionData);
}
