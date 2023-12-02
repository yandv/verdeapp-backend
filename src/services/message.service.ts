import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

class ConnectedSocket {
  socket: Socket;
  userId: number;
}

function toString(socket: ConnectedSocket): string {
  return `${socket.socket.id} (${socket.userId})`;
}

@Injectable()
export class MessageService {
  private readonly clients: Map<string, ConnectedSocket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    const authorization = socket.handshake.headers.authorization;

    if (!authorization) {
      socket.disconnect();
      console.log(`The client ${clientId} tried to connect without authorization.`);
      return;
    }

    const connectedSocket = { socket, userId: 1 };
    this.clients.set(clientId, connectedSocket);

    console.log(`The client ${toString(connectedSocket)} has been connected successfully.`);
    socket.emit('connection', 'Successfully connected to the server');

    socket.on('disconnect', () => {
      this.clients.delete(clientId);
      console.log(`The client ${toString(connectedSocket)} has been disconnected successfully.`);
    });
  }

  handleReceiveMessage(socket: Socket, message: string): void {
    const connectedSocket = this.clients.get(socket.id);

    if (!socket) {
      console.log(`The client ${toString(connectedSocket)} is not connected.`);
      return;
    }

    socket.emit('message', message);
  }
}
