import path from 'path';
import http from 'http';

import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';

import io, { Server } from 'socket.io';
import connectIO from './connect-socket-io';
import connectDB from './connect';
import { EVENTS } from './events';

const app: Application = express();
const httpServer: http.Server = new http.Server(app);
const socketServer: Server = io(httpServer);

const PORT = 3001;

httpServer.listen(PORT, () => console.log(`listening on *: ${PORT}`));

connectDB({ db: 'mongodb://localhost:27017/cgemotions' });
connectIO(socketServer);

app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/dashboard.html");
});

app.get('/update', (req: Request, res: Response) => {
  console.info('get /update');
  const data = {
    recent: {
      time: Date.now(),
      happy: 40,
      anger: -10,
    },
    series: [10, 10, 10, 10, 60]
  };
  socketServer.emit('EVENTS.UPDATE_DASHBOARD', data);
  res.status(200);
  res.send('ok');
});
