import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // If no roles are defined, allow access
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && roles.includes(user.role); // Check if user's role is in the allowed roles
  }
}
