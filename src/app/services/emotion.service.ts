import { Emotion } from "../models/emotion";
import { EmotionRepo } from '../repositories/emotion.repo';
import { IEmotionInput } from '../models/emotion.req';
import { SubEmotion } from '../models/sub-emotion';

function getSystemUTCDate(now: Date): string {
  return `${now.getFullYear()}-${now.getMonth()+1}-${now.getUTCDate()}`;
}

async function updateTodayEmotion(emotion: IEmotionInput): Promise<Emotion> {

  const now = new Date();

  const userFilter = { userId: emotion.userId };
  const todayFilter ={
    "createdAt": {
      "$gte": new Date(now.getFullYear(), now.getMonth(), now.getUTCDate()),
      "$lt": new Date(now.getFullYear(), now.getMonth(), now.getUTCDate() + 1)
    }
  };

  const condition = { ...userFilter, ...todayFilter };
  console.info(condition);
  const savedEmotions = await EmotionRepo.find(condition);

  console.log(savedEmotions);
  let uniqueEmotion: Emotion = {
    emotion: emotion.emotion,
    userId: emotion.userId,
    createdAt: now,
    updatedAt: now,
    history: []
  };

  if (savedEmotions.length > 0) {
    uniqueEmotion = savedEmotions[0];

    let history: SubEmotion[] = uniqueEmotion.history || [];
    for (let i = 0; i < savedEmotions.length; i++) {
      history.push({
        emotion: savedEmotions[i].emotion,
        updatedAt: savedEmotions[i].updatedAt
      });
    }
    EmotionRepo.deleteMany(condition);

    uniqueEmotion.emotion = emotion.emotion;
    uniqueEmotion.updatedAt = now;
    uniqueEmotion.history = history;
  }

  return await EmotionRepo.create(uniqueEmotion)
    .then((data: Emotion) => data)
    .catch(error => {
      throw error;
    });
}

export default {
  updateTodayEmotion
}
