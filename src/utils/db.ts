export function getDBConnectionURI(
  username: string,
  password: string,
  host: string,
  port: number,
  dbName: string): string {
  return `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
}
