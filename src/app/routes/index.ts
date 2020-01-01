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

  app.get('/update', (req: Request, res: Response) => {
    const data = {
      recent: {
        time: Date.now(),
        happy: 40,
        anger: -10,
      },
      series: [10, 10, 10, 10, 60]
    };
    // socketServer.emit();
    // broadcast(EVENTS.UPDATE_DASHBOARD, data);
    socket.emit(EVENTS.UPDATE_DASHBOARD, data);
    res.status(200);
    res.send('ok');
  });

  app.post('/today', async (req: Request, res: Response) => {
    const emotionInput: IEmotionInput = req.body;
    console.log(emotionInput);
    const emotion = await EmotionService.updateTodayEmotion(emotionInput);
    res.send({ message: "ok", data: emotion});
  });

};
