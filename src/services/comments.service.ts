import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Comment } from '../entities/comment.entity';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

@Injectable()
export class CommentsService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  async createComment(commentData: {
    task_id: string;
    author_id: string;
    content: string;
  }): Promise<Comment> {
    const { task_id, author_id, content } = commentData;
    const id = uuidv4(); // Generate a new UUID for the comment
    const created_at = new Date(); // Set the current timestamp

    const query = `
      INSERT INTO comments (id, task_id, author_id, content, created_at) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [id, task_id, author_id, content, created_at];

    const result = await this.pool.query(query, values);
    return result.rows[0]; // Return the newly created comment
  }

  async getCommentsByTaskId(taskId: string): Promise<Comment[]> {
    const query = `SELECT * FROM comments WHERE task_id = $1`;
    const result = await this.pool.query(query, [taskId]);
    return result.rows;
  }

  async updateComment(
    id: string,
    updateData: Partial<Comment>,
  ): Promise<Comment> {
    const { content } = updateData;
    const query = `
      UPDATE comments 
      SET content = $1 
      WHERE id = $2 RETURNING *`;
    const values = [content, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteComment(id: string): Promise<Comment> {
    const query = `DELETE FROM comments WHERE id = $1 RETURNING *`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}
