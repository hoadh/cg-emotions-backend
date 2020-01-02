import { Emotions } from "./emotions.enum";
import { prop } from "@typegoose/typegoose";

export class SubEmotion {

  @prop()
  public emotion?: Emotions | string;

  @prop()
  public updatedAt?: Date;
}