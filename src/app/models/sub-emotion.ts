import { Emotions } from "./emotions.enum";
import { prop } from "@typegoose/typegoose";
import { Note } from './note';

export class SubEmotion {

  @prop()
  public emotion?: Emotions | string;

  @prop()
  public updatedAt?: Date;

  @prop()
  public note?: Note;
}