import { prop, arrayProp } from '@typegoose/typegoose';
import { Emotions } from './emotions.enum';
import { SubEmotion } from './sub-emotion';
import { Note } from './note';

export class Emotion {
  @prop()
  public emotion?: Emotions | string;

  @arrayProp({ items: SubEmotion })
  public history?: SubEmotion[];

  @prop()
  public userId?: string;

  // @prop()
  // public idProvider?: string;

  @prop()
  public createdAt?: Date;

  @prop()
  public updatedAt?: Date;

  @prop()
  public note?: Note;
}