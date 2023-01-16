import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { User } from '../../models/user.js';
import { createSHA256 } from '../../utils/crypto.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.name = data.name;
    this.avatarPath = data.avatarPath;
  }

  @prop({unique: true, required: true, trim: true})
  public email!: string;

  @prop({required: true, default: '', trim: true})
  public name!: string;

  @prop({required: true, default: DEFAULT_AVATAR_FILE_NAME, trim: true})
  public avatarPath!: string;

  @prop({required: true, default: '', trim: true})
  private password!: string;

  @prop({ required: true, default: [] })
  public favoriteMovies!: string[];

  setPassword(password: string, salt: string) {
    if (password.length < 6 || password.length > 12) {
      throw new Error(`Password length must be from 6 to 12 symbols, but found: ${password.length} symbols`);
    }
    this.password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
