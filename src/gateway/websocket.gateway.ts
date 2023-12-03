import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WebsocketService } from "src/services/websocket.service";

@WebSocketGateway({namespace: 'chat'})
export class WebsocketGateway implements OnGatewayConnection {

    @WebSocketServer()
    private server: Server;

    constructor(private readonly websocketService: WebsocketService) { }

    handleConnection(socket: Socket): void {
        this.websocketService.handleConnection(socket);
    }
    
    @SubscribeMessage('message')
    handleMessage(socket: Socket, message: string) {
        this.websocketService.handleReceiveMessage(socket, message);
    }

}