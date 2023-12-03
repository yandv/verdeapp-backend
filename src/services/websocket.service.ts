import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parseAuth } from 'src/utils/string';
import { AuthService } from './auth.service';
import { UserInfoDto } from 'src/model/users/user.dto';

class ConnectedSocket {
  socket: Socket;
  userId: number;
  avatarUrl: string;
}

function toString(socket: ConnectedSocket): string {
  return `${socket.socket.id} (${socket.userId})`;
}

@Injectable()
export class WebsocketService {
  private readonly clients: Map<string, ConnectedSocket> = new Map();

  constructor(private readonly authService: AuthService) {}

  async handleConnection(socket: Socket): Promise<void> {
    const clientId = socket.id;
    const authorization = parseAuth(socket.handshake.headers.authorization);

    if (!authorization) {
      socket.disconnect();
      console.log(`The client ${clientId} tried to connect without authorization.`);
      return;
    }

    let user: UserInfoDto;
    console.log(authorization);

    try {
      user = await this.authService.validateToken(authorization);
    } catch {
      socket.disconnect();
      console.log(`The client ${clientId} tried to connect with an invalid token.`);
      return;
    }

    const connectedSocket = { socket, userId: user.id, avatarUrl: user.imageUrl };
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

    if (!connectedSocket) {
      console.log(`The client ${toString(connectedSocket)} is not connected.`);
      return;
    }

    const { userId: authorId, avatarUrl } = connectedSocket;
    socket.broadcast.emit('message', { authorId, avatarUrl, message });
  }

  isUserOnline(userId: number): boolean {
    return Array.from(this.clients.values()).some((socket) => socket.userId === userId);
  }
}
