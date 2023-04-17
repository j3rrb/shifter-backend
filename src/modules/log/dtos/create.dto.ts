import { IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateUserLogDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
