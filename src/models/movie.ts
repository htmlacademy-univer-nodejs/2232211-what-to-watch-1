import { Genre } from './genre.js';

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
  user: string;
  posterLink: string;
  backgroundImageLink: string;
  backgroundColor: string;
}
