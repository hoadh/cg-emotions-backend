import path from 'path';
import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import io, { Server } from 'socket.io';
import connectIO from './connect-io';
import connectDB from './connect';
import routes from './routes';
import config from './config';

const app: Application = express();
const httpServer: http.Server = new http.Server(app);
const socketServer: Server = io(httpServer);

const PORT = config.PORT || 5000;

httpServer.listen(PORT, () => console.log(`listening on *: ${PORT}`));

const MONGODB_URI = config.MONGODB_URI || '';
connectDB({ db: MONGODB_URI });
connectIO(socketServer);

app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.set('rootDir', __dirname);
routes({ app, broadcast: socketServer.emit.bind(this), socket: socketServer});

