import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageService } from "src/services/message.service";

@WebSocketGateway({namespace: 'messages', cors: true})
export class MessageGateway implements OnGatewayConnection {

    @WebSocketServer()
    private server: Server;

    constructor(private readonly messageService: MessageService) { }

    handleConnection(socket: Socket): void {
        this.messageService.handleConnection(socket);
    }

    @SubscribeMessage('message')
    handleMessage(socket: Socket, message: string) {
        this.messageService.handleReceiveMessage(socket, message);
    }

}