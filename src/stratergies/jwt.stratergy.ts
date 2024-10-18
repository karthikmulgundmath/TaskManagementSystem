import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'; // Correct imports
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(JwtStrategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Ensure this is set in your .env
    });
  }

  async validate(payload: any) {
    return this.usersService.findUserByEmail(payload.email); // Return user data for guards
  }
}
