import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import User from 'src/model/users/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany().then((users) => {
      return users;
    });
  }

  public async findUserBy(params: any): Promise<User> {
    return this.prisma.user.findFirst({
      where: params,
    });
  }

  public async createUser(data: any) {
    return this.prisma.user.create({
      data,
    });
  }

  public async updateUser(params: { where: any; data: any }) {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  public async deleteUseById(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
