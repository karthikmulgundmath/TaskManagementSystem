import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = []; // Replace with database integration

  async createUser(
    name: string,
    email: string,
    password: string,
    role: 'owner' | 'contributor',
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: new Date().toISOString(),
      name,
      email,
      password: hashedPassword,
      role,
    };
    this.users.push(newUser);
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
