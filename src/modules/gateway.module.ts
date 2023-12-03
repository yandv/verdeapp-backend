import { Module } from '@nestjs/common';
import { WebsocketGateway } from 'src/gateway/websocket.gateway';
import { AuthService } from 'src/services/auth.service';
import { WebsocketService } from 'src/services/websocket.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class GatewayModule {}
