import { Expose } from 'class-transformer';
import { Genre } from '../../../models/genre.js';

export default class MovieResponse {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: number;

  @Expose()
  public genre!: Genre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public moviePreviewLink!: string;

  @Expose()
  public movieLink!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public producer!: string;

  @Expose()
  public durationInMinutes!: number;

  @Expose()
  public userId!: string;

  @Expose()
  public posterLink!: string;

  @Expose()
  public backgroundImageLink!: string;

  @Expose()
  public backgroundColor!: string;
}
