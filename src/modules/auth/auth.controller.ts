import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsPublic } from 'src/decorators/public.decorator';
import AuthService from './auth.service';
import LoginDTO from './dtos/login.dto';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post()
  @HttpCode(202)
  async login(@Body() data: LoginDTO) {
    const token = await this.authService.validateCredentials(data);

    return { token };
  }
}
