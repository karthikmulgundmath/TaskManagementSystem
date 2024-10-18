import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['owner']) // Only owners can create projects
  async createProject(@Body() projectData: any) {
    return await this.projectsService.createProject(projectData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllProjects() {
    return await this.projectsService.getAllProjects();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProjectById(@Param('id') id: string) {
    return await this.projectsService.getProjectById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['owner']) // Only owners can update projects
  async updateProject(@Param('id') id: string, @Body() updateData: any) {
    return await this.projectsService.updateProject(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['owner']) // Only owners can delete projects
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }
}
