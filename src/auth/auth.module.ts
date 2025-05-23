import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET', // guárdalo en .env si es posible
      signOptions: { expiresIn: '2d' },
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtModule, AuthModule],
})
export class AuthModule {}
