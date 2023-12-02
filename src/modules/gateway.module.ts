import { Module } from "@nestjs/common";
import { MessageGateway } from "src/gateway/message.gateway";
import { MessageService } from "src/services/message.service";

@Module({
    providers: [MessageGateway, MessageService],
})
export class GatewayModule {}