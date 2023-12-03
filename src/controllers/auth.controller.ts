import { Body, Controller, HttpCode, HttpStatus, Post, Get } from '@nestjs/common';
import { SignInUserDto } from 'src/model/users/user.dto';
import { AuthService } from 'src/services/auth.service';
import { JWT_TOKEN } from 'src/utils/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Get('login')
  async authUser(@Body() signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    return await this.authService.signInUser(signInUserDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Get('register')
  async registerUser(): Promise<any> {
    console.log(JWT_TOKEN)
    return {
      message: 'Register user successfully',
      data: {
        id: 1,
        userName: 'admin',
        email: 'admin@gmail.com',
      },
    };
  }
}
