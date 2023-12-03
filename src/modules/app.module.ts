import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';
import { GatewayModule } from './gateway.module';
import { AuthModule } from './auth.module';
import { ChannelModule } from './channel.module';

@Module({
  imports: [PrismaModule, UserModule, ChannelModule, AuthModule, GatewayModule],
  controllers: [],
  providers: []
})
export class AppModule {}
