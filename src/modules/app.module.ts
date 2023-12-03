import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';
import { GatewayModule } from './gateway.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, GatewayModule],
  controllers: [],
  providers: []
})
export class AppModule {}
