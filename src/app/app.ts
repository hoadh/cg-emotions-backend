import path from 'path';
import http from 'http';
import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import io, { Server } from 'socket.io';
import connectIO from './connect-io';
import connectDB from './connect';
import routes from './routes';

const app: Application = express();
const httpServer: http.Server = new http.Server(app);
const socketServer: Server = io(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`listening on *: ${PORT}`));

connectDB({ db: 'mongodb://localhost:27017/cgemotions' });
connectIO(socketServer);

app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('rootDir', __dirname);
routes({ app, broadcast: socketServer.emit.bind(this), socket: socketServer});

