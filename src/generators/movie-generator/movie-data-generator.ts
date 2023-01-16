import { getRandomItem, getRandomItems, getRandomValue} from '../../utils/random.js';
import dayjs from 'dayjs';
import { IMovieDataGenerator } from './movie-data-generator.interface.js';
import { GENRES } from '../../models/genre.js';
import { MockData } from '../../models/mock-data.js';
import { randomUUID } from 'crypto';

const MAX_RELEASE_YEAR = 2022;
const MIN_RELEASE_YEAR = 1895;
const MAX_MOVIE_DURATION = 240;
const MIN_MOVIE_DURATION = 60;
const MAX_MOVIE_RATING = 10;
const MIN_MOVIE_RATING = 0;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class MovieDataGenerator implements IMovieDataGenerator {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(getRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItem(GENRES);
    const releaseYear = getRandomValue(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR);
    const rating = getRandomValue(MIN_MOVIE_RATING, MAX_MOVIE_RATING, 2);
    const moviePreviewLink = getRandomItem<string>(this.mockData.moviePreviewLinks);
    const movieLink = getRandomItem<string>(this.mockData.movieLinks);
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const producer = getRandomItem<string>(this.mockData.producers);
    const durationInMinutes = getRandomValue(MIN_MOVIE_DURATION, MAX_MOVIE_DURATION);
    const commentsCount = 0;
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatarPaths);
    const password = randomUUID();
    const user = [userName, email, avatar, password].join(';');
    const posterPath = getRandomItem<string>(this.mockData.posterPaths);
    const backgroundImagePath = getRandomItem<string>(this.mockData.backgroundImagePaths);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

    return [
      title,
      description,
      publicationDate,
      genre,
      releaseYear,
      rating,
      moviePreviewLink,
      movieLink,
      actors,
      producer,
      durationInMinutes,
      commentsCount,
      user,
      posterPath,
      backgroundImagePath,
      backgroundColor
    ].join('\t');
  }
}
