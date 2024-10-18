import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TasksService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  async createTask(taskData: any): Promise<any> {
    const {
      title,
      description,
      status,
      priority,
      project_id,
      assigned_user_id,
      due_date,
    } = taskData;
    const query = `INSERT INTO tasks (title, description, status, priority, project_id, assigned_user_id, due_date) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
      title,
      description,
      status,
      priority,
      project_id,
      assigned_user_id,
      due_date,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateTask(id: string, updateData: any): Promise<any> {
    const { status, priority, assigned_user_id } = updateData;
    const query = `UPDATE tasks SET status = $1, priority = $2, assigned_user_id = $3 WHERE id = $4 RETURNING *`;
    const values = [status, priority, assigned_user_id, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
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
