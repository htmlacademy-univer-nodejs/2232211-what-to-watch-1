import { Genre } from './genre.js';
import { User } from './user.js';

export type Movie = {
  title: string;
  description: string;
  publicationDate: Date;
  genre: Genre;
  releaseYear: number;
  rating: number;
  moviePreviewLink: string;
  movieLink: string;
  actors: string[];
  producer: string;
  durationInMinutes: number;
  commentsCount: number;
  user: User;
  posterPath: string;
  backgroundImagePath: string;
  backgroundColor: string;
}
