import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';
import { GatewayModule } from './gateway.module';

@Module({
  imports: [PrismaModule, UserModule, GatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
