import { Inject, Injectable } from '@nestjs/common';
import { JWT_CONFIG_OPTIONS } from 'src/jwt/jwt.constants';
import { JwtModuleOptions } from 'src/jwt/jwt.interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_CONFIG_OPTIONS)
    private readonly jwtConfigOptions: JwtModuleOptions,
  ) {}

  sign(payload) {
    try {
      return jwt.sign(payload, this.jwtConfigOptions.secretKey);
    } catch (e) {
      console.log(e);
    }
  }

  verify(token: string) {
    return jwt.verify(token, this.jwtConfigOptions.secretKey);
  }
}
