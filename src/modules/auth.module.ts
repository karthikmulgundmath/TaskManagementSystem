import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users.module';
import { JwtAuthStrategy } from '../stratergies/jwt.stratergy';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use the secret from the .env file
      signOptions: { expiresIn: '60m' }, // Optional: Set token expiration time
    }),
  ],
  providers: [AuthService, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
