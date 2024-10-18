import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export the service for use in other modules
})
export class UsersModule {}
