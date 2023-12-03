import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from 'src/services/auth.service';
import { JWT_TOKEN } from 'src/utils/constants';
import { parseAuth } from 'src/utils/string';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = parseAuth(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.authService.validateToken(token);
    } catch (ex) {
      throw new UnauthorizedException('Invalid token or session expired');
    }
    return true;
  }
}
