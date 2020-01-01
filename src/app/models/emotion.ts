import { prop, arrayProp } from '@typegoose/typegoose';
import { EmotionList } from './emotions.enum';

export class Emotion {
  @prop()
  public name?: EmotionList;

  // @arrayProp({ items: String })
  // public history?: EmotionList[];

  // @prop()
  // public userId?: string;

  // @prop()
  // public idProvider?: string;
}