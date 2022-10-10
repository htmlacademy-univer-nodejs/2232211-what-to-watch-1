import { Movie } from '../models/movie.js';
import { IsNullOrWhiteSpace } from './string-utils.js';
import { toGenre } from '../models/genre.js';
import { User } from '../models/user.js';

const getUser = (user: string): User => {
  const [nickname, email, avatar, password] = user.split(';');

  return {
    nickname: nickname,
    email: email,
    avatar: avatar,
    password: password
  };
};

export const toMovie = (row: string): Movie => {
  const items = row.toString().split('\t');

  const [
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
    posterLink,
    backgroundImageLink,
    backgroundColor
  ] = items;

  return ({
    title: title,
    description: description,
    publicationDate: new Date(publicationDate),
    genre: toGenre(genre),
    releaseYear: parseInt(releaseYear, 10),
    rating: parseFloat(rating),
    moviePreviewLink: moviePreviewLink,
    movieLink: movieLink,
    actors: actors.split(';'),
    producer: producer,
    durationInMinutes: parseInt(durationInMinutes, 10),
    commentsCount: parseInt(commentsCount, 10),
    user: getUser(user),
    posterLink: posterLink,
    backgroundImageLink: backgroundImageLink,
    backgroundColor: backgroundColor
  });
};

export const toMovies = (content: string): Movie[] => content
  .split('\n')
  .filter((row) => !IsNullOrWhiteSpace(row))
  .map((row) => toMovie(row));
