import { Controller, Post, Put, Get, Param, Body, Query } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() taskData: any) {
    return await this.tasksService.createTask(taskData);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() updateData: any) {
    return await this.tasksService.updateTask(id, updateData);
  }

  @Get('query')
  async queryTasks(@Query() filters: any) {
    return await this.tasksService.queryTasks(filters);
  }
}
