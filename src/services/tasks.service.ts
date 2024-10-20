import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { TaskLogService } from './task-log.service';
import { TaskLog } from '../entities/task-log.entity';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from 'src/types/express-request.interface';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TasksService {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Constructor for TasksService class.
   * @param pool PostgreSQL connection pool injected using PG_CONNECTION token
   * @param taskLogService Instance of TaskLogService for logging tasks
   */
  /******  34d77b81-63ea-4359-ad11-066900a6a180  *******/ constructor(
    @Inject('PG_CONNECTION') private pool: Pool,
    private taskLogService: TaskLogService,
  ) {}

  private async checkIfOwner(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    const query = `SELECT owner_id FROM projects WHERE id = $1`;
    const result = await this.pool.query(query, [projectId]);
    const project = result.rows[0];

    if (!project || project.owner_id !== userId) {
      throw new ForbiddenException(
        'Only project owners can perform this action.',
      );
    }
    return true;
  }

  async createTask(taskData: any, req: AuthenticatedRequest): Promise<TaskLog> {
    const user = req.user as User; // `req.user` is now properly typed

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    await this.checkIfOwner(user.id, taskData.project_id);

    // Update: Use `assigned_user_id` instead of `author_id`
    const createdTask = await this.pool.query(
      `INSERT INTO tasks (id, title, status, project_id, assigned_user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [uuidv4(), taskData.title, taskData.status, taskData.project_id, user.id], // `user.id` is set as `assigned_user_id`
    );

    await this.taskLogService.createTaskLog({
      task_id: createdTask.rows[0].id,
      previous_status: 'N/A',
      new_status: taskData.status,
      changed_by: user.id,
    });

    return createdTask.rows[0];
  }

  async updateTask(
    id: string,
    updateData: any,
    req: AuthenticatedRequest,
  ): Promise<TaskLog> {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    const previousTask = await this.pool.query(
      `SELECT status FROM tasks WHERE id = $1`,
      [id],
    );
    const previousStatus = previousTask.rows[0]?.status;

    await this.checkIfOwner(user.id, updateData.project_id);

    const updatedTask = await this.pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [updateData.status, id],
    );

    await this.taskLogService.createTaskLog({
      task_id: id,
      previous_status: previousStatus,
      new_status: updateData.status,
      changed_by: user.id,
    });

    return updatedTask.rows[0];
  }

  async queryTasks(filters: any): Promise<any> {
    let query = `SELECT * FROM tasks WHERE 1=1`;
    const values = [];

    if (filters.project_id) {
      query += ` AND project_id = $${values.length + 1}`;
      values.push(filters.project_id);
    }
    if (filters.assigned_user_id) {
      query += ` AND assigned_user_id = $${values.length + 1}`;
      values.push(filters.assigned_user_id);
    }
    if (filters.status) {
      query += ` AND status = $${values.length + 1}`;
      values.push(filters.status);
    }
    if (filters.priority) {
      query += ` AND priority = $${values.length + 1}`;
      values.push(filters.priority);
    }
    if (filters.due_in_days) {
      query += ` AND due_date <= NOW() + interval '$${values.length + 1} days'`;
      values.push(filters.due_in_days);
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }
}
