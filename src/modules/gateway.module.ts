import { Module } from "@nestjs/common";
import { WebsocketGateway } from "src/gateway/websocket.gateway";
import { WebsocketService } from "src/services/websocket.service";

@Module({
    providers: [WebsocketGateway, WebsocketService],
})
export class GatewayModule {}