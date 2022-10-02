import { ICommand } from './command.interface.js';
import { MovieTsvFileReader } from '../../fileReaders/movieTsvFileReader.js';

export default class ImportCommand implements ICommand {
  public readonly commandName = '--import';

  execute(filename: string): void {
    const fileReader = new MovieTsvFileReader();

    try {
      const movies = fileReader.read(filename.trim());
      console.log(JSON.stringify(movies, null, 2));
    } catch (err) {
      console.error(`Import failed: "${err}"`);
    }
  }
}
