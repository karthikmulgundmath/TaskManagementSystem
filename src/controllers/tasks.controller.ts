import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Assuming you're using a JWT Auth Guard for authentication

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Protect the route with JWT authentication
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(@Body() taskData: any, @Req() req: Request) {
    // Pass the request object to the service so it can access the user details
    return await this.tasksService.createTask(taskData, req);
  }

  // Protect the route with JWT authentication
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateData: any,
    @Req() req: Request,
  ) {
    // Pass the request object to the service so it can access the user details
    return await this.tasksService.updateTask(id, updateData, req);
  }

  // Query tasks does not necessarily need user authentication, depending on your requirements
  @Get('query')
  async queryTasks(@Query() filters: any) {
    return await this.tasksService.queryTasks(filters);
  }
}
