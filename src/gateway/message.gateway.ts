import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthGuard } from "src/security/auth.guard";
import { MessageService } from "src/services/message.service";
import { UseGuards } from "@nestjs/common";

@WebSocketGateway({namespace: 'messages'})
export class MessageGateway implements OnGatewayConnection {

    @WebSocketServer()
    private server: Server;

    constructor(private readonly messageService: MessageService) { }

    handleConnection(socket: Socket): void {
        this.messageService.handleConnection(socket);
    }
    
    @UseGuards(AuthGuard)
    @SubscribeMessage('message')
    handleMessage(socket: Socket, message: string) {
        this.messageService.handleReceiveMessage(socket, message);
    }

}