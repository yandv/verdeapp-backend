import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { messageSchema } from 'src/model/message/message.dto';
import { WebsocketService } from 'src/services/websocket.service';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly websocketService: WebsocketService) {}

  handleConnection(socket: Socket): void {
    this.websocketService.handleConnection(socket);
  }

  @SubscribeMessage('message')
  handleMessage(socket: Socket, message: string) {
    const valid = messageSchema.safeParse(message);

    if (!valid.success) {
      console.log('Invalid message received: ', message);
      return;
    }
    
    this.websocketService.handleReceiveMessage(socket, message);
  }
}
