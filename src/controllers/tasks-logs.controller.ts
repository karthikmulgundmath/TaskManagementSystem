import { Controller, Get, Param } from '@nestjs/common';
import { TaskLogService } from '../services/task-log.service';

@Controller('task-logs')
export class TaskLogsController {
  constructor(private readonly taskLogService: TaskLogService) {}

  @Get('task/:taskId')
  async getLogsByTaskId(@Param('taskId') taskId: string) {
    return await this.taskLogService.getLogsByTaskId(taskId);
  }
}
