import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { TaskLog } from '../entities/task-log.entity';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

@Injectable()
export class TaskLogService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  async createTaskLog(taskLogData: {
    task_id: string;
    previous_status: string;
    new_status: string;
    changed_by: string;
  }): Promise<TaskLog> {
    const { task_id, previous_status, new_status, changed_by } = taskLogData;
    const id = uuidv4(); // Generate a new UUID for the task log
    const updated_at = new Date(); // Set the current timestamp

    const query = `
      INSERT INTO task_logs (id, task_id, updated_at, previous_status, new_status, changed_by) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [
      id,
      task_id,
      updated_at,
      previous_status,
      new_status,
      changed_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0]; // Return the newly created task log entry
  }

  // New method to get logs by task ID
  async getLogsByTaskId(taskId: string): Promise<TaskLog[]> {
    const query = `SELECT * FROM task_logs WHERE task_id = $1 ORDER BY updated_at DESC`;
    const result = await this.pool.query(query, [taskId]);
    return result.rows; // Return the list of logs for the given task ID
  }
}
