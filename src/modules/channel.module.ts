import { Module } from '@nestjs/common';
import { ChannelController } from 'src/controllers/channel.controller';
import { AuthService } from 'src/services/auth.service';
import { ChannelService } from 'src/services/channel.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [],
  controllers: [ChannelController],
  providers: [ChannelService, UserService, AuthService],
  exports: [ChannelService],
})
export class ChannelModule {}
