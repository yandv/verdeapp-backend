import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
