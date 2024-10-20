import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../src/controllers/tasks.controller';
import { TasksService } from '../src/services/tasks.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../src/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: Partial<TasksService>;

  beforeEach(async () => {
    tasksService = {
      createTask: jest.fn(),
      updateTask: jest.fn(),
      queryTasks: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: tasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = { title: 'New Task', description: 'Task Description' };
      const req: Request = { user: { id: 'user-id' } } as unknown as Request; // Mocking the request object

      tasksService.createTask = jest.fn().mockResolvedValue(taskData);

      const result = await controller.createTask(taskData, req);

      expect(result).toEqual(taskData);
      expect(tasksService.createTask).toHaveBeenCalledWith(taskData, req);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const id = '1';
      const updateData = { title: 'Updated Task' };
      const req: Request = { user: { id: 'user-id' } } as unknown as Request; // Mocking the request object

      tasksService.updateTask = jest
        .fn()
        .mockResolvedValue({ id, ...updateData });

      const result = await controller.updateTask(id, updateData, req);

      expect(result).toEqual({ id, ...updateData });
      expect(tasksService.updateTask).toHaveBeenCalledWith(id, updateData, req);
    });
  });

  describe('queryTasks', () => {
    it('should return a list of tasks based on query filters', async () => {
      const filters = { status: 'completed' };
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'completed' },
        { id: '2', title: 'Task 2', status: 'completed' },
      ];

      tasksService.queryTasks = jest.fn().mockResolvedValue(mockTasks);

      const result = await controller.queryTasks(filters);

      expect(result).toEqual(mockTasks);
      expect(tasksService.queryTasks).toHaveBeenCalledWith(filters);
    });
  });
});
