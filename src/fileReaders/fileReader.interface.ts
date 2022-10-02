export interface IFileReader<TResult> {
  read(filepath: string): TResult[];
}
