import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ForbiddenException } from '@nestjs/common'; // To throw forbidden errors

@Injectable()
export class ProjectsService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  // Utility function to check if the user is an owner
  private async checkIfOwner(userId: string): Promise<boolean> {
    const query = `SELECT role FROM users WHERE id = $1`;
    const result = await this.pool.query(query, [userId]);
    const user = result.rows[0];
    if (!user || user.role !== 'owner') {
      throw new ForbiddenException('Only owners can perform this action');
    }
    return true; // User is an owner
  }

  async createProject(projectData: any): Promise<any> {
    const { name, owner_id } = projectData;

    // Ensure the user is an owner
    await this.checkIfOwner(owner_id);

    const query = `INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *`;
    const values = [name, owner_id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getAllProjects(): Promise<any> {
    const query = `SELECT * FROM projects`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getProjectById(id: string): Promise<any> {
    const query = `SELECT * FROM projects WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async updateProject(id: string, updateData: any): Promise<any> {
    const { name, owner_id } = updateData;

    // Ensure the user is an owner
    await this.checkIfOwner(owner_id);

    const query = `UPDATE projects SET name = $1, owner_id = $2 WHERE id = $3 RETURNING *`;
    const values = [name, owner_id, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteProject(id: string, owner_id: string): Promise<any> {
    // Ensure the user is an owner
    await this.checkIfOwner(owner_id);

    const query = `DELETE FROM projects WHERE id = $1 RETURNING *`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}
