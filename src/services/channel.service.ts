import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateChannelDto } from 'src/model/channel/channel.dto';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserChannels(userId: number, page: number = 1, itemsPerPage: number = 15): Promise<any> {
    return this.prisma.channel.findMany({
      where: {
        participants: {
            some: {
                userId: userId
            }
        }
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });
  }

  async createChannel(data: CreateChannelDto) {
    return await this.prisma.channel.create({
      data: {
        name: data.name,
        participants: {
          create: data.participants.map((participant) => ({ userId: participant })),
        },
      },
    });
  }

  async removeUserFromChannel(channelId: number, userId: number) {
    return await this.prisma.userInChannel.delete({
      where: {
        userId_channelId: {
          channelId,
          userId,
        },
      },
    });
  }

  async addUserToChannel(channelId: number, userId: number) {
    return await this.prisma.userInChannel.create({
      data: {
        channelId,
        userId,
      },
    });
  }

  async getChannelsByUserId(userId: number) {
    return await this.prisma.channel.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async getChannelById(channelId: number) {
    return await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
  }

  async getUsersInChannel(channelId: number, page: number = 1, itemsPerPage: number = 15): Promise<any> {
    return await this.prisma.userInChannel.findMany({
      where: {
        channelId,
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      select: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            bio: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async isUserInChannel(userId: number, channelId: number): Promise<boolean> {
    return await this.prisma.userInChannel
      .findFirst({
        where: {
          channelId,
          userId,
        },
      })
      .then((userInChannel) => !!userInChannel);
  }

  async getMessagesInChannel(channelId: number, page: number = 1, itemsPerPage: number = 50): Promise<any> {
    return await this.prisma.message.findMany({
      where: {
        channelId,
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            bio: true,
            imageUrl: true,
          },
        },
      },
    });
  }
}
