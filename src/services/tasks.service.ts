import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { TaskLogService } from './task-log.service'; // Import TaskLogService
import { TaskLog } from '../entities/task-log.entity'; // Assuming you have a Task entity
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

@Injectable()
export class TasksService {
  constructor(
    @Inject('PG_CONNECTION') private pool: Pool,
    private taskLogService: TaskLogService, // Inject TaskLogService
  ) {}

  async createTask(taskData: any): Promise<TaskLog> {
    // Your existing logic to create a task
    const createdTask = await this.pool.query(/* your insert logic here */);

    // Log the task creation
    await this.taskLogService.createTaskLog({
      task_id: createdTask.id, // Use the ID of the created task
      previous_status: 'N/A', // No previous status when creating
      new_status: taskData.status, // Use the status from taskData
      changed_by: taskData.author_id, // Assuming you pass the author ID
    });

    return createdTask.rows[0];
  }

  async updateTask(id: string, updateData: any): Promise<TaskLog> {
    // Fetch the previous status before updating
    const previousTask = await this.pool.query(
      `SELECT status FROM tasks WHERE id = $1`,
      [id],
    );
    const previousStatus = previousTask.rows[0]?.status;

    // Your existing logic to update a task
    const updatedTask = await this.pool.query(/* your update logic here */);

    // Log the task update
    await this.taskLogService.createTaskLog({
      task_id: id,
      previous_status: previousStatus,
      new_status: updateData.status, // New status from the updateData
      changed_by: updateData.author_id, // Assuming you pass the author ID
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
