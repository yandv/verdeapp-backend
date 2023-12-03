import User from 'src/model/users/user.entity';

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  HttpStatus,
  HttpException,
  UsePipes,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
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
  async retrieveUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('itemsPerPage', new ParseIntPipe({ optional: true })) itemsPerPage: number = 15
  ): Promise<UserInfoDto[]> {
    const users = await this.userService.getUsers(page, itemsPerPage);

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

  @UseGuards(AuthGuard)
  @Get('/:id/friends')
  async getUserFriends(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('itemsPerPage', new ParseIntPipe({ optional: true })) itemsPerPage: number = 15
  ): Promise<UserInfoDto[]> {
    const user = await this.userService.findUserBy({ id });

    if (user) {
      const friends = await this.userService.getUserFriends(req.user.id, page, itemsPerPage);

      if (friends.length) return friends;

      throw new HttpException('No friends found', HttpStatus.NOT_FOUND);
    }

    throw new HttpException('No user found', HttpStatus.NOT_FOUND);
  }

  @Post('/')
  async createUser(@Body() user: CreateUserDto): Promise<UserInfoDto> {
    let currentUser = await this.userService.findUserBy({ userName: user.userName });

    if (currentUser)
      throw new HttpException(
        { statusCode: 409, message: 'User already exists', error: 'userName' },
        HttpStatus.CONFLICT
      );

    currentUser = await this.userService.findUserBy({ email: user.email });

    if (currentUser)
      throw new HttpException({ statusCode: 409, message: 'User already exists', error: 'email' }, HttpStatus.CONFLICT);

    return this.userService.createUser(user);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateUser(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() user: User): Promise<UserInfoDto> {
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
