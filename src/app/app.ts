import path from 'path';
import http from 'http';

import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';

import socketIO, { Socket } from 'socket.io';


const app: Application = express();
const httpServer: http.Server = new http.Server(app);
const socketServer: socketIO.Server = socketIO(httpServer);

const ACTION_UPDATE_DASHBOARD = "update dashboard";
const PORT = 3001;

httpServer.listen(PORT, () => console.log(`listening on *: ${PORT}`));

socketServer.on('connection', (socket: Socket) => {
  console.log('A new connection has established at ' + Date.now());
  socket.on(ACTION_UPDATE_DASHBOARD, msg => {
    socketServer.emit(msg);
    console.log(msg);
  });
});


app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/dashboard.html");
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
  socketServer.emit(ACTION_UPDATE_DASHBOARD, data);
  res.status(200);
  res.send('ok');
})
