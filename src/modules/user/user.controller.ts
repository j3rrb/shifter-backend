import { Body, Controller, Post } from '@nestjs/common';
import { IsPublic } from 'src/decorators/public.decorator';
import CreateUserDTO from './dto/create.dto';
import UserService from './user.service';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateUserDTO) {
    const createdUser = await this.userService.create(dto);

    return createdUser;
  }
}
