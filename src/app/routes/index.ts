import { Application, Request, Response} from 'express';
import { EVENTS } from '../events';
import { Server } from 'socket.io';
import { IEmotionInput } from '../models/emotion.req';
import EmotionService from '../services/emotion.service';

type TRouteInput = {
  app: Application;
  broadcast: any;
  socket: Server;
}

export default ({ app, broadcast, socket }: TRouteInput) => {
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(app.get('rootDir') + "/views/dashboard.html");
  });

  app.get('/today', async (req: Request, res: Response) => {
    const series = await EmotionService.getStatData();
    const stat = {
      recent: {
        time: Date.now()
      },
      series
    }
    socket.emit(EVENTS.UPDATE_DASHBOARD, stat);
    res.send({ message: "ok", data: stat });
  });

  app.get('/recents', async (req: Request, res: Response) => {
    const limit: number = parseInt(req.query.limit) || 3;
    const emotions = await EmotionService.getLastestUpdates(limit);
    res.send({ message: "ok", data: emotions });
  });

  app.post('/today', async (req: Request, res: Response) => {
    const emotionInput = req.body as IEmotionInput;
    console.log(emotionInput);
    const emotion = await EmotionService.updateTodayEmotion(emotionInput);
    const series = await EmotionService.getStatData();
    const stat = {
      recent: {
        time: Date.now()
      },
      series
    }
    const recent = {
      emotion: emotion.emotion,
      user: emotion.user,
      updateAt: emotion.updatedAt,
      note: (emotion.note?.isPublic) ? emotion.note : {}
    }
    socket.emit(EVENTS.UPDATE_DASHBOARD, stat);
    socket.emit(EVENTS.RECENT_USER, recent);
    res.send({ message: "ok", data: emotion});
  });

  app.get('/history', async (req: Request, res: Response) => {
    const userId = req.query.userId;
    if (userId) {
      const history = await EmotionService.getUserHistory(userId);
      res.send({ message: "ok", data: history });
    } else {
      res.send({ message: "not found", data: {
        userId: userId
      } });
    }
  });

};
