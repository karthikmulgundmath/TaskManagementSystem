import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ProjectsService } from '../src/services/projects.service';
import { JwtAuthGuard } from '../src/guards/jwt-auth.guard';
import { RolesGuard } from '../src/guards/roles.guard';

describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  let projectsService = {
    createProject: jest.fn(),
    getAllProjects: jest.fn(),
    getProjectById: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProjectsService)
      .useValue(projectsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/projects (POST)', () => {
    it('should create a project', async () => {
      const projectData = { name: 'New Project' };
      const mockUser = { id: 'owner-id' };

      // Mocking the service response
      projectsService.createProject.mockResolvedValue({
        ...projectData,
        owner_id: mockUser.id,
      });

      const response = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer token`) // Simulate JWT token
        .send(projectData)
        .expect(201);

      expect(response.body).toEqual({ ...projectData, owner_id: mockUser.id });
      expect(projectsService.createProject).toHaveBeenCalledWith({
        ...projectData,
        owner_id: mockUser.id,
      });
    });
  });

  describe('/projects (GET)', () => {
    it('should return all projects', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ];
      projectsService.getAllProjects.mockResolvedValue(mockProjects);

      const response = await request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer token`)
        .expect(200);

      expect(response.body).toEqual(mockProjects);
      expect(projectsService.getAllProjects).toHaveBeenCalled();
    });
  });

  describe('/projects/:id (GET)', () => {
    it('should return a project by id', async () => {
      const projectId = '1';
      const mockProject = { id: projectId, name: 'Project 1' };
      projectsService.getProjectById.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer token`)
        .expect(200);

      expect(response.body).toEqual(mockProject);
      expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
    });
  });

  describe('/projects/:id (PUT)', () => {
    it('should update a project', async () => {
      const projectId = '1';
      const updateData = { name: 'Updated Project' };
      const mockUser = { id: 'owner-id' };

      // Mocking the service response
      projectsService.updateProject.mockResolvedValue({
        ...updateData,
        owner_id: mockUser.id,
      });

      const response = await request(app.getHttpServer())
        .put(`/projects/${projectId}`)
        .set('Authorization', `Bearer token`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({ ...updateData, owner_id: mockUser.id });
      expect(projectsService.updateProject).toHaveBeenCalledWith(projectId, {
        ...updateData,
        owner_id: mockUser.id,
      });
    });
  });

  describe('/projects/:id (DELETE)', () => {
    it('should delete a project', async () => {
      const projectId = '1';
      const mockUser = { id: 'owner-id' };
      projectsService.deleteProject.mockResolvedValue({ success: true });

      const response = await request(app.getHttpServer())
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer token`)
        .expect(200);

      expect(response.body).toEqual({ success: true });
      expect(projectsService.deleteProject).toHaveBeenCalledWith(
        projectId,
        mockUser.id,
      );
    });
  });
});
