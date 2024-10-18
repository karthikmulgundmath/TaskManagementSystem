import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto'; // Import LoginDto

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    // Use LoginDto here
    return await this.authService.login(loginData);
  }
}
