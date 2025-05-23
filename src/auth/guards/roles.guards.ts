import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    const foundUser = await this.userService.findOneUser(user.userId);
    if (!foundUser || !foundUser.isActive) {
      throw new ForbiddenException('Access denied! User is inactive.');
    }
    const hasRole = requiredRoles.includes(foundUser.role);
    if (!hasRole) {
      throw new ForbiddenException('Access denied! Role not authorized.');
    }

    return true;
  }
}
