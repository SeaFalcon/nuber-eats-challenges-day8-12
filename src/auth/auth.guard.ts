import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/auth.decorator';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('RolesGuard needs authorization: ' + requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];

    if (!user) {
      return false;
    }

    console.log(user.role, requiredRoles, requiredRoles.includes(user.role));

    return requiredRoles.includes(user.role);

    // console.log(user);
  }
}
