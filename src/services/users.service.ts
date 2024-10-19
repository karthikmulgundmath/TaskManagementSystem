import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt'; // For hashing passwords
import { v4 as uuidv4 } from 'uuid'; // Import UUID

@Injectable()
export class UsersService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {} // Inject PostgreSQL pool

  async createUser(
    name: string,
    email: string,
    password: string,
    role: 'owner' | 'contributor',
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role,
    };

    // Insert into the database using the PostgreSQL connection pool
    const query = `
      INSERT INTO users (id, name, email, password, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.role,
    ];

    const result = await this.pool.query(query, values); // Use the injected pool
    return result.rows[0]; // Return the created user
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    const result = await this.pool.query(query, values);

    // Return the first user found, or undefined if no user is found
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return undefined;
  }
}
