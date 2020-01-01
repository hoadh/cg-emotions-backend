import connect from './connect';
import { EmotionList } from './models/emotions.enum';
import { Emotion }  from './models/emotion';
import { EmotionRepo } from './repositories/emotion.repo';
connect({ db: 'mongodb://localhost:27017/cgemotions'});

(async () => {
  const emotion: Emotion = { name: EmotionList.HAPPY };
  const { _id: id } = await EmotionRepo.create(emotion); // an "as" assertion, to have types for all properties
  const emo = await EmotionRepo.findById(id).exec();
  console.log(emo);
})();

