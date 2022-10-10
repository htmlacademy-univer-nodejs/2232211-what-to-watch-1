export interface IFileReader {
  read(filepath: string): Promise<void>;
}
