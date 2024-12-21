import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body()
    userData: {
      name: string;
      email: string;
      password: string;
      role: 'owner' | 'contributor';
    },
  ) {
    return await this.usersService.createUser(
      userData.name,
      userData.email,
      userData.password,
      userData.role,
    );
  }

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }
}
