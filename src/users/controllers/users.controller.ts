import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDto } from '../dto/user-create.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async createUser(@Body() body: UserCreateDto): Promise<UserCreateDto> {
    return this.userService.createUser(body);
  }
}
