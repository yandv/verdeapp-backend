import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_TOKEN } from 'src/utils/constants';
import { parseAuth } from 'src/utils/string';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = parseAuth(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      request.user = await this.jwtService.verifyAsync(token, {
        secret: JWT_TOKEN,
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
