import { Genre } from '../../../models/genre.js';
import { User } from '../../../models/user.js';

export default class UpdateMovieDto {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public genre!: Genre;
  public releaseYear!: number;
  public rating!: number;
  public moviePreviewLink!: string;
  public movieLink!: string;
  public actors!: string[];
  public producer!: string;
  public durationInMinutes!: number;
  public commentsCount!: number;
  public user!: User;
  public posterLink!: string;
  public backgroundImageLink!: string;
  public backgroundColor!: string;
}
