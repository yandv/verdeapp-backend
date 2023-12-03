import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user.module';
import { JWT_TOKEN } from 'src/utils/constants';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_TOKEN,
      signOptions: { expiresIn: '60s' },
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
