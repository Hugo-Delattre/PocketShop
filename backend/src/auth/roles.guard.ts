import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    if (!requiredRoles) {
      return true;
    }

    const user = request.user; // assume request.user is set from a previous auth middleware
    return requiredRoles.some((role) => user.role.includes(role));
  }
}
