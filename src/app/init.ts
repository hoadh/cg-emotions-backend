import connect from './connect';
import emotion from './models/emotion';
connect({ db: 'mongodb://localhost:27017/cgemotions'});

(async () => {
  const { _id: id } = await emotion.EmotionRepo.create({ name: 'happy' }); // an "as" assertion, to have types for all properties
  const emo = await emotion.EmotionRepo.findById(id).exec();

  console.log(emo); // prints { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
})();