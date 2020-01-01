import { Server, Socket } from 'socket.io';
const ACTION_UPDATE_DASHBOARD = "update dashboard";

export default (server: Server) => {
  server.on('connection', (socket: Socket) => {
    console.info('A new connection has established at ' + Date.now());
    socket.on(ACTION_UPDATE_DASHBOARD, msg => {
      server.emit(msg);
    });
  });
}