import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('authorization' in req.headers) {
      const authorization = req.headers['authorization'];

      if (authorization.startsWith('Bearer')) {
        const token = authorization.split(' ')[1];
        const decoded = this.jwtService.verify(token);

        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          try {
            const user = await this.usersService.findById(decoded['id']);
            req['user'] = user;
          } catch (err) {}
        }
      }
    }
    next();
  }
}
