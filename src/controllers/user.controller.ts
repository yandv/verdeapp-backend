import { Controller, Get, Post, Body, Put, Param, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import User from 'src/model/users/user.entity';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async retrieveUsers(): Promise<any> {
    const users = await this.userService.getUsers();

    if (users.length) return users;

    throw new HttpException('No users found', HttpStatus.NOT_FOUND);
  }

  @Post('/')
  createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() user: User): Promise<User> {
    return this.userService.updateUser({
      where: { id },
      data: user,
    });
  }
}
