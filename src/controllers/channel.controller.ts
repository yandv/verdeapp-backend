import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ChannelService } from 'src/services/channel.service';
import { AuthGuard } from 'src/security/auth.guard';
import { CreateChannelDto } from 'src/model/channel/channel.dto';

@UseGuards(AuthGuard)
@UsePipes(ZodValidationPipe)
@Controller('/channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('/:id/participants')
  async getParticipantsByChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('itemsPerPage', new ParseIntPipe({ optional: true })) itemsPerPage: number = 15
  ) {
    const isParticipant = await this.channelService.isUserInChannel(id, req.user.userId);

    if (!isParticipant) throw new HttpException('You are not a participant of this channel', HttpStatus.FORBIDDEN);

    const channel = await this.channelService.getChannelById(id);

    if (!channel) throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

    const participants = await this.channelService.getUsersInChannel(id, page, itemsPerPage);

    console.log(page, itemsPerPage);

    if (participants.length) return participants;

    throw new HttpException('No participants found in this channel', HttpStatus.NOT_FOUND);
  }

  @Get('/:id/messages')
  async getMessagesByChannel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('itemsPerPage', new ParseIntPipe({ optional: true })) itemsPerPage: number = 15
  ) {
    const isParticipant = await this.channelService.isUserInChannel(id, req.user.id);

    if (!isParticipant) throw new HttpException('You are not a participant of this channel', HttpStatus.FORBIDDEN);

    const channel = await this.channelService.getChannelById(id);

    if (!channel) throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

    const messages = await this.channelService.getMessagesInChannel(id, page, itemsPerPage);

    if (messages.length) return messages;

    throw new HttpException('No messages found in this channel', HttpStatus.NOT_FOUND);
  }

  @Get('/')
  async retrieveChannels(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('itemsPerPage', new ParseIntPipe({ optional: true })) itemsPerPage: number = 15
  ) {
    const channels = await this.channelService.getUserChannels(req.user.id, page, itemsPerPage);

    if (channels.length) return channels;

    throw new HttpException('No channels found', HttpStatus.NOT_FOUND);
  }

  @Post('/')
  async createChannel(@Body() channel: CreateChannelDto) {
    return this.channelService.createChannel(channel);
  }

  @Delete('/:id/participants/:userId')
  async removeUserFromChannel(
    @Param('id', ParseIntPipe) channelId: number,
    @Param('userId', ParseIntPipe) userId: number
  ) {
    return await this.channelService.removeUserFromChannel(channelId, userId);
  }
}
