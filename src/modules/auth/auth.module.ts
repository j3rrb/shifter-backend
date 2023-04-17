import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthEntity from './entities/auth.entity';
import AuthController from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth/jwt.guard';
import UserModule from '@modules/user/user.module';
import UserEntity from '@modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
      global: true,
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, AuthService],
})
export default class AuthModule {}
