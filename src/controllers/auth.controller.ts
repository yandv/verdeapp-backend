import { Body, Controller, HttpCode, HttpStatus, Post, Get, UsePipes, UseGuards, Request } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { SignInUserDto } from 'src/model/users/user.dto';
import { AuthGuard } from 'src/security/auth.guard';
import { AuthService } from 'src/services/auth.service';
import { JWT_TOKEN } from 'src/utils/constants';

@UsePipes(ZodValidationPipe)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async authUser(@Body() signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    return await this.authService.signInUser(signInUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Get('profile')
  async profile(@Request() req): Promise<any> {
    return req.user
  }
}
