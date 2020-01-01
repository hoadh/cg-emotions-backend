import { getModelForClass } from '@typegoose/typegoose';
import { Emotion } from '../models/emotion';

export const EmotionRepo = getModelForClass(Emotion);