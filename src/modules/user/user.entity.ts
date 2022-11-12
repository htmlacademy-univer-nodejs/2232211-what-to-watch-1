import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { User } from '../../models/user.js';
import { createSHA256 } from '../../utils/crypto.js';

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
    this.nickname = data.nickname;
    this.avatar = data.avatar;
  }

  @prop({unique: true, required: true})
  public email!: string;

  @prop({required: true, default: ''})
  public nickname!: string;

  @prop({required: true, default: ''})
  public avatar!: string;

  @prop({required: true, default: ''})
  private password!: string;

  setPassword(password: string, salt: string) {
    if (password.length < 6 || password.length > 12) {
      throw new Error(`Password length must be from 6 to 12 symbols, but found: ${password.length} symbols`);
    }
    this.password = createSHA256(password, salt);
  }

  getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
