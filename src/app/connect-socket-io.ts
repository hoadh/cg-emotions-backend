import { Server, Socket } from 'socket.io';
import { EVENTS } from './events';

export default (server: Server) => {
  server.on('connection', (socket: Socket) => {
    console.info('A new connection has established at ' + Date.now());
    socket.on('EVENTS.UPDATE_DASHBOARD', msg => {
      console.log('EVENT:', EVENTS.UPDATE_DASHBOARD);
      server.emit(msg);
    });
  });
}