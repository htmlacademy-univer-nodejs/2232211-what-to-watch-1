import { Genre, Genres } from '../../../models/genre.js';
import { IsArray, IsDateString, IsEnum, IsInt, IsMongoId, IsString, Length, Matches, Max, Min } from 'class-validator';

export default class CreateMovieDto {
  @Length(2, 100, {message: 'title length must be from 2 to 100 symbols'})
  public title!: string;

  @Length(20, 1024, {message: 'description length must be from 20 to 1024 symbols'})
  public description!: string;

  @IsDateString({}, {message: 'publicationDate must be valid ISO date'})
  public publicationDate!: Date;

  @IsEnum(Genres, {message: `genre must be one of: ${Genres.join(', ')}`})
  public genre!: Genre;

  @IsInt({message: 'releaseYear must be an integer'})
  @Min(1895, {message: 'Minimum releaseYear is 1895'})
  @Max(2022, {message: 'Maximum releaseYear is 2022'})
  public releaseYear!: number;

  @IsString({message: 'moviePreviewLink is required'})
  public moviePreviewLink!: string;

  @IsString({message: 'movieLink is required'})
  public movieLink!: string;

  @IsArray({message: 'actors must be an array'})
  public actors!: string[];

  @IsString({message: 'producer is required'})
  public producer!: string;

  @IsInt({message: 'durationInMinutes must be an integer'})
  @Min(0, {message: 'durationInMinutes can not be less than 0'})
  public durationInMinutes!: number;

  @IsMongoId({message: 'userId field must be valid an id'})
  public userId!: string;

  @Matches(/(\S+(\.jpg)$)/, {message: 'posterLink must be .jpg format image'})
  @IsString({message: 'posterLink is required'})
  public posterLink!: string;

  @Matches(/(\S+(\.jpg)$)/, {message: 'backgroundImageLink must be .jpg format image'})
  @IsString({message: 'backgroundImageLink is required'})
  public backgroundImageLink!: string;

  @IsString({message: 'backgroundColor is required'})
  public backgroundColor!: string;
}
