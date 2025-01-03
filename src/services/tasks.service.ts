import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { TaskLogService } from './task-log.service';
import { TaskLog } from '../entities/task-log.entity';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from 'src/types/express-request.interface';
import { User } from 'src/entities/user.entity';
import { PubSub } from '@google-cloud/pubsub'; // Import Google Cloud PubSub

@Injectable()
export class TasksService {
  private pubSubClient = new PubSub(); // Create a Pub/Sub client
  constructor(
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

  // Function to publish a notification to the assigned user
  private async publishTaskNotification(task: any): Promise<void> {
    const topicName = `projects/${process.env.PROJECT_ID}/topics/${process.env.TOPIC_NAME}`; // Construct the topic name
    console.log('topicName', topicName);
    const message = JSON.stringify({
      userId: task.assigned_user_id,
      taskId: task.id,
      taskTitle: task.title,
      dueDate: task.due_date,
      projectId: task.project_id,
    });
    console.log('message', message);

    await this.pubSubClient
      .topic(topicName)
      .publish(Buffer.from(message))
      .catch((error) => console.log('error in publishing message', error));
  }

  async createTask(taskData: any, req: AuthenticatedRequest): Promise<TaskLog> {
    const user = req.user as User;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    // Check if the task has an assigned user
    if (!taskData.assigned_user_id) {
      throw new BadRequestException('Task must be assigned to a user.');
    }

    await this.checkIfOwner(user.id, taskData.project_id);

    const createdTask = await this.pool.query(
      `INSERT INTO tasks (id, title, description, status, priority, project_id, assigned_user_id, due_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        uuidv4(), // task id
        taskData.title, // task title
        taskData.description, // task description
        taskData.status, // task status
        taskData.priority, // task priority
        taskData.project_id, // project ID
        taskData.assigned_user_id, // assigned user ID
        taskData.due_date, // due date
      ],
    );

    // Log task creation
    await this.taskLogService.createTaskLog({
      task_id: createdTask.rows[0].id,
      previous_status: 'N/A',
      new_status: taskData.status,
      changed_by: user.id,
    });

    // Publish a notification to the assigned user
    await this.publishTaskNotification(createdTask.rows[0]);

    return createdTask.rows[0];
  }

  async updateTask(
    id: string,
    updateData: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      due_date: string;
      project_id: string;
      assigned_user_id: string;
    }>,
    req: AuthenticatedRequest,
  ): Promise<TaskLog> {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    // Validate the status value if provided
    const allowedStatuses = ['pending', 'in_progress', 'completed'];
    if (updateData.status && !allowedStatuses.includes(updateData.status)) {
      throw new BadRequestException(
        `Invalid status value: ${updateData.status}. Allowed values are: ${allowedStatuses.join(', ')}`,
      );
    }

    // Fetch the previous task for logging purposes
    const previousTask = await this.pool.query(
      `SELECT * FROM tasks WHERE id = $1`,
      [id],
    );
    if (!previousTask.rows.length) {
      throw new BadRequestException('Task not found.');
    }
    const previousData = previousTask.rows[0];

    // Construct dynamic SQL for updating
    const updateFields = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updateData)];

    // Update task in the database
    const query = `UPDATE tasks SET ${updateFields} WHERE id = $1 RETURNING *`;
    const updatedTask = await this.pool.query(query, values);

    // Log the changes
    await this.taskLogService.createTaskLog({
      task_id: id,
      previous_status: previousData.status,
      new_status: updateData.status || previousData.status,
      changed_by: user.id,
    });

    return updatedTask.rows[0];
  }

  async queryTasks(filters: any): Promise<any> {
    let query = `
      SELECT 
        tasks.*, 
        COALESCE(json_agg(comments) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comments 
      FROM tasks
      LEFT JOIN comments ON tasks.id = comments.task_id
      WHERE 1=1
    `;

    const values = [];

    if (filters.project_id) {
      query += ` AND tasks.project_id = $${values.length + 1}`;
      values.push(filters.project_id);
    }
    if (filters.assigned_user_id) {
      query += ` AND tasks.assigned_user_id = $${values.length + 1}`;
      values.push(filters.assigned_user_id);
    }
    if (filters.status) {
      query += ` AND tasks.status = $${values.length + 1}`;
      values.push(filters.status);
    }
    if (filters.priority) {
      query += ` AND tasks.priority = $${values.length + 1}`;
      values.push(filters.priority);
    }
    if (filters.due_in_days) {
      query += ` AND tasks.due_date <= NOW() + interval '$${values.length + 1} days'`;
      values.push(filters.due_in_days);
    }

    // Add search by comment content if provided
    if (filters.comment_search) {
      query += ` AND comments.content ILIKE $${values.length + 1}`;
      values.push(`%${filters.comment_search}%`);
    }

    // Group by task ID to avoid multiple rows per task
    query += ` GROUP BY tasks.id`;

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async deleteTask(id: string): Promise<any> {
    const query = `DELETE FROM tasks WHERE id = $1 RETURNING *`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}
