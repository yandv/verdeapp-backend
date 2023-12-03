import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import User from 'src/model/users/user.entity';
import { CreateUserDto, UserInfoDto } from 'src/model/users/user.dto';
import { DEFAULT_BIO_TEXT, DEFAULT_IMAGE_URL } from 'src/utils/constants';
import EncryptionUtils from 'src/utils/encryption.utils';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUsers(page: number = 1, itemsPerPage: number = 15): Promise<User[]> {
    return this.prisma.user.findMany({ skip: (page - 1) * itemsPerPage }).then((users) => {
      return users;
    });
  }

  public async findUserBy(params: any): Promise<User> {
    return this.prisma.user.findFirst({
      where: params,
    });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserInfoDto> {
    const createdUser = await this.prisma.user.create({
      data: {
        userName: createUserDto.userName,
        email: createUserDto.email,
        password: await EncryptionUtils.encrypt(createUserDto.passWord),
        bio: DEFAULT_BIO_TEXT,
        imageUrl: DEFAULT_IMAGE_URL,
      },
    })

    const { password, ...result } = createdUser;
    return result;
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
