import { ICommand } from './command.interface.js';
import { MovieTsvFileReader } from '../../file-readers/movie-tsv-file-reader.js';
import { IUserService } from '../../modules/user/user-service.interface.js';
import { IMovieService } from '../../modules/movie/movie-service.interface.js';
import { IDatabase } from '../../common/db-client/database.interface.js';
import { ILog } from '../../common/loggers/logger.interface.js';
import ConsoleLog from '../../common/loggers/logger-console.js';
import MovieService from '../../modules/movie/movie.service.js';
import UserService from '../../modules/user/user.service.js';
import MongoDBService from '../../common/db-client/mongodb.service.js';
import { MovieModel } from '../../modules/movie/movie.entity.js';
import { UserModel } from '../../modules/user/user.entity.js';
import { getDBConnectionURIFromConfig } from '../../utils/db.js';
import { Movie } from '../../models/movie.js';
import { toMovie } from '../../utils/movie.js';
import { IConfig } from '../../common/config/config.interface.js';
import ConfigService from '../../common/config/config.service.js';

const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements ICommand {
  public readonly commandName = '--import';
  private readonly config!: IConfig;
  private readonly log: ILog;
  private userService!: IUserService;
  private movieService!: IMovieService;
  private databaseService!: IDatabase;
  private salt!: string;

  constructor() {
    this.log = new ConsoleLog();
    this.movieService = new MovieService(this.log, MovieModel);
    this.userService = new UserService(this.log, UserModel);
    this.databaseService = new MongoDBService(this.log);
    this.config = new ConfigService(this.log);
  }

  async execute(filename: string): Promise<void> {
    const uri = getDBConnectionURIFromConfig(this.config);
    this.salt = this.config.get('SALT');

    await this.databaseService.connect(uri);
    const fileReader = new MovieTsvFileReader();

    fileReader.on('movie', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      const movies = fileReader.read(filename.trim());
      console.log(JSON.stringify(movies, null, 2));
    } catch (err) {
      console.error(`Import failed: '${err}'`);
    }

    return Promise.resolve();
  }

  private saveMovie = async (movie: Movie) => {
    const user = await this.userService.obtain({
      ...movie.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.movieService.create({
      ...movie,
      userId: user.id,
    });
  };

  private onLine = async (line: string, resolve: () => void) => {
    const movie = toMovie(line);
    console.log(`New movie: ${JSON.stringify(movie, null, 2)}`);
    await this.saveMovie(movie);
    resolve();
  };

  private onComplete = async (count: number) => {
    console.log(`${count} rows imported.`);
    await this.databaseService.disconnect();
  };
}
