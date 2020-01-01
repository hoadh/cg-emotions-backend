import { prop, arrayProp, getModelForClass } from '@typegoose/typegoose';

// enum EmotionList {
//   HAPPY = 'happy',
//   NORMAL = 'normal',
//   ANGER = 'anger',
// }

class Emotion {
  @prop()
  public name?: string;

  // @arrayProp({ items: String })
  // public history?: EmotionList[];

  // @prop()
  // public userId?: string;

  // @prop()
  // public idProvider?: string;
}

export default { Emotion, EmotionRepo: getModelForClass(Emotion) };