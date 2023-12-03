import User from 'src/model/users/user.entity';

import { Controller, Get, Post, Body, Put, Param, HttpStatus, HttpException, UsePipes, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UserInfoDto } from 'src/model/users/user.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthGuard } from 'src/security/auth.guard';

@UsePipes(ZodValidationPipe)
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async retrieveUsers(): Promise<UserInfoDto[]> {
    const users = await this.userService.getUsers();

    if (users.length) return users.map(({ password, ...user }) => user);

    throw new HttpException('No users found', HttpStatus.NOT_FOUND);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async retriveUserById(@Param('id', ParseIntPipe) id: number): Promise<UserInfoDto> {
    const user = await this.userService.findUserBy({ id });

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    throw new HttpException('No user found', HttpStatus.NOT_FOUND);
  }

  @Post('/')
  async createUser(@Body() user: CreateUserDto): Promise<UserInfoDto> {
    const currentUser = await this.userService.findUserBy({ OR: [{ userName: user.userName }, { email: user.email }] });
    if (currentUser) throw new HttpException('User already exists', HttpStatus.CONFLICT);
    return this.userService.createUser(user);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateUser(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() user: User): Promise<User> {
    if (req.user.id !== id) throw new HttpException('You cant update other users', HttpStatus.FORBIDDEN);

    return this.userService.updateUser({
      where: { id },
      data: user,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUser(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<UserInfoDto> {
    if (req.user.id !== id) throw new HttpException('You cant update other users', HttpStatus.FORBIDDEN);

    const user = await this.userService.findUserBy({ id });

    if (!user) throw new HttpException('No user found', HttpStatus.NOT_FOUND);

    await this.userService.deleteUseById(id);
    const { password, ...result } = user;

    return result;
  }
}
