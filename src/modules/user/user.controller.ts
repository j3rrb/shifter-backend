import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { IsPublic } from 'src/decorators/public.decorator';
import CreateUserDTO from './dto/create.dto';
import UserService from './user.service';
import { CurrentUser } from 'src/decorators/current_user.dto';
import UserEntity from './entities/user.entity';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateUserDTO) {
    const createdUser = await this.userService.create(dto);

    return createdUser;
  }

  @Get('logs')
  async getLogs(
    @CurrentUser() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const data = await this.userService.getLogs(user.id, limit, page);

    return data;
  }
}
