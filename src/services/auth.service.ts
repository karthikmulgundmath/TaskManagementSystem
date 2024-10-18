import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto'; // Import LoginDto
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginData: LoginDto) {
    // Accept LoginDto here
    const user = await this.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new Error('Invalid credentials'); // You can also throw a specific exception here
    }
    const payload = { email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
