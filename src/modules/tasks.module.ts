// src/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from '../controllers/tasks.controller';
import { TasksService } from '../services/tasks.service';
import { TaskLogsModule } from './task-logs.module'; // Import TaskLogsModule

@Module({
  imports: [TaskLogsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
