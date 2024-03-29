import typegoose, { defaultClasses, Ref, getModelForClass } from '@typegoose/typegoose';
import { Genre, GENRES } from '../../models/genre.js';
import { UserEntity } from '../user/user.entity.js';
import { Types } from 'mongoose';

const { prop, modelOptions } = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true})
  public id!: string;

  @prop({trim: true, required: true, minlength: 2, maxlength: 100})
  public title!: string;

  @prop({trim: true, required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public publicationDate!: Date;

  @prop({type: () => String, required: true, enum: GENRES})
  public genre!: Genre;

  @prop({required: true})
  public releaseYear!: number;

  @prop({required: true, default: 0})
  public rating!: number;

  @prop({required: true, trim: true})
  public moviePreviewLink!: string;

  @prop({required: true, trim: true})
  public movieLink!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true, minlength: 2, maxlength: 50, trim: true})
  public producer!: string;

  @prop({required: true})
  public durationInMinutes!: number;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({type: Types.ObjectId, ref: UserEntity, required: true})
  public user: Ref<UserEntity>;

  @prop({required: true, match: /(\S+(\.jpg)$)/, trim: true})
  public posterPath!: string;

  @prop({required: true, match: /(\S+(\.jpg)$)/, trim: true})
  public backgroundImagePath!: string;

  @prop({required: true, trim: true})
  public backgroundColor!: string;

  @prop()
  public isPromo?: boolean;
}

export const MovieModel = getModelForClass(MovieEntity);
