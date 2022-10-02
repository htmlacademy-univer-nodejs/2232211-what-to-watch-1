import { IFileReader } from './fileReader.interface.js';
import { Movie } from '../models/movie.js';
import { readFileSync } from 'fs';
import { IsNullOrWhiteSpace } from '../utils/stringUtils.js';
import { Genre } from '../models/genre.js';

export class MovieTsvFileReader implements IFileReader<Movie> {
  read(filepath: string): Movie[] {
    const file = readFileSync(filepath, { encoding: 'utf8' });

    return file
      .split('\n')
      .filter((row) => !IsNullOrWhiteSpace(row))
      .map((row) => row.split('\t'))
      .map(([
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
        userNickname,
        userEmail,
        userAvatar,
        userPassword,
        posterLink,
        backgroundImageLink,
        backgroundColor
      ]) => ({
        title: title,
        description: description,
        publicationDate: new Date(publicationDate),
        genre: genre as Genre,
        releaseYear: parseInt(releaseYear, 10),
        rating: parseFloat(rating),
        moviePreviewLink: moviePreviewLink,
        movieLink: movieLink,
        actors: actors.split(';'),
        producer: producer,
        durationInMinutes: parseInt(durationInMinutes, 10),
        commentsCount: parseInt(commentsCount, 10),
        user: { nickname: userNickname, email: userEmail, avatar: userAvatar, password: userPassword},
        posterLink: posterLink,
        backgroundImageLink: backgroundImageLink,
        backgroundColor: backgroundColor
      }));
  }
}
