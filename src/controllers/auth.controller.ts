import { Body, Controller, HttpCode, HttpStatus, Post, Get, UsePipes, UseGuards, Request } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { SignInUserDto, UserInfoDto } from 'src/model/users/user.dto';
import { AuthGuard } from 'src/security/auth.guard';
import { AuthService } from 'src/services/auth.service';

@UsePipes(ZodValidationPipe)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async authUser(@Body() signInUserDto: SignInUserDto): Promise<{ token: string; user: UserInfoDto }> {
    return await this.authService.signInUser(signInUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Get('profile')
  async profile(@Request() req): Promise<UserInfoDto> {
    return req.user;
  }
}
