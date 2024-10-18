import { Module } from '@nestjs/common';
import { TaskLogsController } from '../controllers/tasks-logs.controller';
import { TaskLogService } from '../services/task-log.service';

@Module({
  controllers: [TaskLogsController],
  providers: [TaskLogService],
  exports: [TaskLogService], // Export TaskLogService so it can be used in other modules
})
export class TaskLogsModule {}
