import { createWriteStream, WriteStream } from 'fs';
import { IFileWriter } from './file-writer.interface.js';

const BUFFER_SIZE = 2 ** 16;

export default class TSVFileWriter implements IFileWriter {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: BUFFER_SIZE,
      autoClose: true
    });
  }

  public async write(line: string): Promise<void> {
    if (!this.stream.write(`${line}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
    return Promise.resolve();
  }
}
