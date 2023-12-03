import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { SignInUserDto, UserInfoDto } from 'src/model/users/user.dto';
import User from 'src/model/users/user.entity';
import EncryptionUtils from 'src/utils/encryption.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signInUser(signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    const { user: userId, passWord } = signInUserDto;
    const user: User = await this.userService.findUserBy({ OR: [{ userName: userId }, { email: userId }] });

    if (!user) throw new UnauthorizedException();

    const authenticated: boolean = await EncryptionUtils.compare(passWord, user?.password);

    if (!authenticated) throw new UnauthorizedException()

    const { password, ...result } = user;
    const payload = { userId: result.id, userName: result.userName, email: result.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async validateToken(token: string): Promise<UserInfoDto> {
    const { userId, userName, email } = await this.jwtService.verifyAsync(token);
    const user: User = await this.userService.findUserBy({ id: userId });

    if (!user) throw new UnauthorizedException();

    if (user.userName !== userName || user.email !== email) throw new UnauthorizedException();

    const { password, ...result } = user;
    return result;
  }
}
