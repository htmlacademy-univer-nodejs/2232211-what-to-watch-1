import { ICommand } from './command.interface.js';
import { MockData } from '../../models/mock-data.js';
import got from 'got';
import MovieDataGenerator from '../../generators/movie-generator/movie-data-generator.js';
import TSVFileWriter from '../../file-writers/tsv-file-writer.js';

export default class GenerateCommand implements ICommand {
  public readonly commandName = '--generate';

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const moviesCount = parseInt(count, 10);
    let initialData: MockData | null = null;

    try {
      initialData = await got.get(url).json();
    } catch {
      return console.error(`Can't fetch data from ${url}.`);
    }

    if (!initialData) {
      return console.error('Empty initial data.');
    }

    const movieDataGenerator = new MovieDataGenerator(initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < moviesCount; i++) {
      await tsvFileWriter.write(movieDataGenerator.generate());
    }

    console.log(`File '${filepath}' generated successfully.`);
  }
}
