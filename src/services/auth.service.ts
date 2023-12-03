import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { SignInUserDto } from 'src/model/users/user.dto';
import User from 'src/model/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signInUser(signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    const { email, userName, passWord } = signInUserDto;
    const user: User = await this.userService.findUserBy({ OR: { email, userName } });

    if (user?.password !== passWord) throw new UnauthorizedException();

    const { password, ...result } = user;
    const payload = { userId: result.id, userName: result.userName, email: result.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
