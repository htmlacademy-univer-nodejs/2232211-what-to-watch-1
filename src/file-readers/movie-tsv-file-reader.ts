import { IFileReader } from './file-reader.interface.js';
import { createReadStream } from 'fs';
import EventEmitter from 'events';
import { toMovie } from '../utils/movie.js';

export class MovieTsvFileReader extends EventEmitter.EventEmitter implements IFileReader {
  async read(filepath: string): Promise<void> {
    const stream = createReadStream(filepath, { encoding: 'utf8' });

    let chunkContent = '';
    let importedRowCount = 0;
    let endLinePosition = -1;

    for await (const chunk of stream) {
      chunkContent += chunk.toString();

      while ((endLinePosition = chunkContent.indexOf('\n')) >= 0) {
        const completeRow = chunkContent.slice(0, endLinePosition + 1);
        chunkContent = chunkContent.slice(++endLinePosition);
        importedRowCount++;

        this.emit('movie', toMovie(completeRow));
      }
    }

    this.emit('end', importedRowCount);
  }
}
