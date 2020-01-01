import { Emotion } from "../models/emotion";
import { EmotionRepo } from '../repositories/emotion.repo';
import { IEmotionInput } from '../models/emotion.req';

async function updateTodayEmotion(emotion: IEmotionInput): Promise<Emotion> {
  return await EmotionRepo.create(emotion)
    .then( (data: Emotion) => data)
    .catch( error => {
      throw error;
    });
}

export default {
  updateTodayEmotion
}