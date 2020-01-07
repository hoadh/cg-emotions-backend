import { Emotion } from "../models/emotion";
import { EmotionRepo } from '../repositories/emotion.repo';
import { IEmotionInput } from '../models/emotion.req';
import { SubEmotion } from '../models/sub-emotion';
import { Emotions } from "../models/emotions.enum";

async function updateTodayEmotion(emotion: IEmotionInput): Promise<Emotion> {

  const now = new Date();

  const userFilter = { userId: emotion.userId };
  const todayFilter = getDayFilter(now);

  const condition = { ...userFilter, ...todayFilter };
  const savedEmotions = await EmotionRepo.find(condition);

  let uniqueEmotion: Emotion = {
    ...emotion,
    createdAt: now,
    updatedAt: now,
    history: []
  };

  if (savedEmotions.length > 0) {
    uniqueEmotion = savedEmotions[0];

    // get previous updated emotion and save into history array
    let history: SubEmotion[] = uniqueEmotion.history || [];
    for (let i = 0; i < savedEmotions.length; i++) {
      history.push({
        emotion: savedEmotions[i].emotion,
        updatedAt: savedEmotions[i].updatedAt,
        note: savedEmotions[i].note
      });
    }
    uniqueEmotion.history = history;
    // end

    uniqueEmotion.emotion = emotion.emotion;
    uniqueEmotion.updatedAt = now;
    uniqueEmotion.note = emotion.note;
    uniqueEmotion.user = emotion.user;
    uniqueEmotion.userId = emotion.userId;

    EmotionRepo.deleteMany(condition);
  }

  return await EmotionRepo.create(uniqueEmotion)
    .then((data: Emotion) => data)
    .catch(error => {
      throw error;
    });
}

async function getUserHistory(userId: string): Promise<Emotion[]> {
  const userFilter = { userId: userId };
  const savedEmotions = await EmotionRepo.find(userFilter);
  return new Promise((resolve, reject) => resolve(savedEmotions) );
}

async function getStatData(): Promise<number[]> {
  const now = new Date();
  const todayFilter = getDayFilter(now);

  const savedEmotions = await EmotionRepo.find(todayFilter);
  const { happy, good, normal, bad, anger } = countEmotions(savedEmotions);
  return new Promise( (resolve, reject) => {
    resolve([happy, good, normal, bad, anger]);
  })
}

async function getLastestUpdates(limit: number = 3):Promise<Emotion[]> {
  const now = new Date();
  const condition = getDayFilter(now);
  const projection = { "emotion": 1, "user": 1, "updatedAt": 1, "note": 1 };

  return new Promise(async (resolve, reject) => {
    try {
      const emotions = await EmotionRepo.find(condition, projection).limit(limit).sort({ "updatedAt": -1 });
      resolve(emotions);
    } catch (e) {
      reject(e);
    }
  })
}

export default {
  updateTodayEmotion,
  getStatData,
  getLastestUpdates,
  getUserHistory
}

function countEmotions(savedEmotions: Emotion[]) {
  let happy = 0, good = 0, normal = 0, bad = 0, anger = 0;
  for (let i = 0; i < savedEmotions.length; i++) {
    switch (savedEmotions[i].emotion) {
      case Emotions.HAPPY: happy++; break;
      case Emotions.GOOD: good++; break;
      case Emotions.NORMAL: normal++; break;
      case Emotions.BAD: bad++; break;
      case Emotions.ANGER: anger++; break;
    }
  }
  return {
    happy, good, normal, bad, anger
  }
}

function getDayFilter(date: Date) {
  const now = new Date();
  const todayFilter = {
    "createdAt": {
      "$gte": new Date(date.getFullYear(), date.getMonth(), date.getUTCDate()),
      "$lt": new Date(date.getFullYear(), date.getMonth(), date.getUTCDate() + 1)
    }
  };
  return todayFilter;
}
