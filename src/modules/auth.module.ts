import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users.module'; // Import UsersModule
import { JwtAuthStrategy } from '../stratergies/jwt.stratergy'; // Import JwtAuthStrategy

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Your JWT secret from .env
      signOptions: { expiresIn: '60m' }, // Token expiration time
    }),
  ],
  providers: [AuthService, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
