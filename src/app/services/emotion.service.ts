import { Emotion } from "../models/emotion";
import { EmotionRepo } from '../repositories/emotion.repo';
import { IEmotionInput } from '../models/emotion.req';
import { SubEmotion } from '../models/sub-emotion';
import { Emotions } from "../models/emotions.enum";
import datetime from "../core/datetime";


async function updateTodayEmotionAnonymous(emotion: IEmotionInput): Promise<Emotion> {
  const localDate = datetime.getLocalDate(new Date());
  const now = datetime.UTCDate(localDate.year, localDate.month, localDate.day);
  let newEmotion: Emotion = {
    emotion: emotion.emotion,
    createdAt: now,
    updatedAt: now,
    timezoneOffset: now.getTimezoneOffset(),
    history: [],
    note: emotion.note
  };

  return await EmotionRepo.create(newEmotion)
    .then((data: Emotion) => data)
    .catch(error => {
      throw error;
    });
}

async function updateTodayEmotion(emotion: IEmotionInput): Promise<Emotion> {

  const userFilter = { userId: emotion.userId },
        todayFilter = getDateFilter();

  const condition = { ...userFilter, ...todayFilter };
  const savedEmotions = await EmotionRepo.find(condition);

  const now = new Date();
  let newEmotion: Emotion = {
    emotion: emotion.emotion,
    userId: emotion.userId,
    createdAt: now,
    updatedAt: now,
    timezoneOffset: now.getTimezoneOffset(),
    history: [],
    note: emotion.note,
    user: emotion.user
  };

  if (savedEmotions.length > 0) {
    newEmotion = savedEmotions[0];

    // get previous updated emotion and save into history array
    let history: SubEmotion[] = newEmotion.history || [];
    for (let i = 0; i < savedEmotions.length; i++) {
      history.push({
        emotion: savedEmotions[i].emotion,
        updatedAt: savedEmotions[i].updatedAt,
        note: savedEmotions[i].note
      });
    }
    newEmotion.history = history;
    // end

    newEmotion.emotion = emotion.emotion;
    newEmotion.updatedAt = now;
    newEmotion.timezoneOffset = now.getTimezoneOffset();
    newEmotion.note = emotion.note;
    newEmotion.user = emotion.user;
    newEmotion.userId = emotion.userId;

    // const deleteCount = await EmotionRepo.deleteMany(condition);
  }
  return await EmotionRepo.create(newEmotion)
    .then((data: Emotion) => data)
    .catch(error => {
      throw error;
    });
}

async function getUserHistory(userId: string): Promise<Emotion[]> {
  const userFilter = { userId: userId };
  const savedEmotions = await EmotionRepo.find(userFilter).sort({ "createdAt": -1, "updatedAt": -1 });
  return new Promise((resolve, reject) => resolve(savedEmotions) );
}

async function getStatData(): Promise<number[]> {
  const todayFilter = getDateFilter();
  const savedEmotions = await EmotionRepo.find(todayFilter);
  const { happy, good, normal, bad, anger } = countEmotions(savedEmotions);
  return new Promise( (resolve, reject) => {
    resolve([happy, good, normal, bad, anger]);
  })
}

async function getLastestUpdates(limit: number = 3):Promise<Emotion[]> {
  const todayFilter = getDateFilter();
  const projection = { "emotion": 1, "user": 1, "updatedAt": 1, "note": 1 };

  return new Promise(async (resolve, reject) => {
    try {
      const emotions = await EmotionRepo.find(todayFilter, projection).limit(limit).sort({ "updatedAt": -1 });
      resolve(emotions);
    } catch (e) {
      reject(e);
    }
  })
}

export default {
  updateTodayEmotionAnonymous,
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

function getDateFilter() {
  let now = new Date(),
    next = new Date();
  next.setDate(now.getDate() + 1);

  const today = datetime.getLocalDate(now),
    tomorrow = datetime.getLocalDate(next);

  const startDate = datetime.UTCDate(today.year, today.month, today.day),
    endDate = datetime.UTCDate(tomorrow.year, tomorrow.month, tomorrow.day);

  const minDiff = now.getTimezoneOffset();
  const miliDiff = minDiff * 60 * 1000;
  startDate.setTime(startDate.getTime() + miliDiff);
  endDate.setTime(endDate.getTime() + miliDiff);

  const filter = {
    "createdAt": {
      "$gte": startDate,
      "$lt": endDate
    }
  };

  return filter;
}