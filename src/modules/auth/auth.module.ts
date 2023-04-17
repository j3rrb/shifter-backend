import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthEntity from './entities/auth.entity';
import AuthController from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity])],
  providers: [AuthService],
  controllers: [AuthController],
})
export default class AuthModule {}
