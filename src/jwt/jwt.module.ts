import { DynamicModule, Module } from '@nestjs/common';
import { JWT_CONFIG_OPTIONS } from 'src/jwt/jwt.constants';
import { JwtModuleOptions } from 'src/jwt/jwt.interfaces';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersModule } from 'src/users/users.module';

@Module({})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      global: true,
      imports: [UsersModule],
      module: JwtModule,
      providers: [
        {
          provide: JWT_CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
