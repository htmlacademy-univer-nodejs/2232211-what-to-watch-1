import { prop, modelOptions, defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { User } from '../../models/user.js';
import { createSHA256 } from '../../utils/crypto.js';

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
    this.password = createSHA256(password, salt);
  }

  getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
