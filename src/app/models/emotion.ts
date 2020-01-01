import { prop, arrayProp } from '@typegoose/typegoose';
import { Emotions } from './emotions.enum';

export class Emotion {
  @prop()
  public emotion?: Emotions;

  // @arrayProp({ items: String })
  // public history?: EmotionList[];

  @prop()
  public userId?: string;

  // @prop()
  // public idProvider?: string;
}