import { prop } from "@typegoose/typegoose";

export class User {

  @prop()
  public name?: string;

  @prop()
  public email?: string;

  @prop()
  public userId?: string;
}