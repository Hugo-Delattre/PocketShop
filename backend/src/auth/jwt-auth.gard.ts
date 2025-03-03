import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './data';
import { AuthService } from './auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import type { JwtPayload } from './types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('You do not have permission (Token)');
    }

    const token = authorization.split(' ')[1];
    //Token is null or Bad token
    if (!token || !this.authService.verify(token)) {
      throw new UnauthorizedException('You do not have permission (Token)');
    }

    //Convert token to jwtPayload object
    const payload: JwtPayload = this.authService.decode(token);
    // id from token exist in DB ?

    const user = await this.authService.findPayloadUser(payload);

    if (!user) {
      throw new UnauthorizedException(
        'You do not have permission (Authentification)',
      );
    }
    const result = await super.canActivate(context);
    return result instanceof Observable ? await firstValueFrom(result) : result;
  }
}
