import { ICommand } from './command.interface.js';
import { MovieTsvFileReader } from '../../file-readers/movie-tsv-file-reader.js';

export default class ImportCommand implements ICommand {
  public readonly commandName = '--import';

  execute(filename: string): Promise<void> {
    const fileReader = new MovieTsvFileReader();

    fileReader.on('movie', (movie) => console.log(`New movie: ${JSON.stringify(movie, null, 2)}`));
    fileReader.on('end', (count) => console.log(`${count} rows imported.`));

    try {
      const movies = fileReader.read(filename.trim());
      console.log(JSON.stringify(movies, null, 2));
    } catch (err) {
      console.error(`Import failed: "${err}"`);
    }

    return Promise.resolve();
  }
}
