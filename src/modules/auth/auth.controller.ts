import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsPublic } from 'src/decorators/public.decorator';
import AuthService from './auth.service';
import LoginDTO from './dtos/login.dto';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post()
  async login(@Body() data: LoginDTO) {
    const token = await this.authService.validateCredentials(data);

    return { token };
  }
}
