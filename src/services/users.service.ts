import { Injectable, Inject, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt'; // For hashing passwords
import { v4 as uuidv4 } from 'uuid'; // Import UUID

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject('PG_CONNECTION') private readonly pool: Pool) {}

  /**
   * Creates a new user in the database.
   * @param name - Name of the user
   * @param email - Email of the user
   * @param password - Plain text password of the user
   * @param role - Role of the user (owner or contributor)
   * @returns The created user object
   */
  async createUser(
    name: string,
    email: string,
    password: string,
    role: 'owner' | 'contributor',
  ): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role,
      };

      const query = `
        INSERT INTO users (id, name, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.password,
        newUser.role,
      ];

      const result = await this.pool.query(query, values);
      this.logger.log(`User created with email: ${email}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(
        `Error creating user with email: ${email}`,
        error.stack,
      );
      throw new Error('Unable to create user. Please try again later.');
    }
  }

  /**
   * Finds a user in the database by their email.
   * @param email - Email of the user
   * @returns The user object if found, otherwise undefined
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const values = [email];

      const result = await this.pool.query(query, values);

      if (result.rows.length > 0) {
        this.logger.log(`User found with email: ${email}`);
        return result.rows[0];
      }

      this.logger.warn(`No user found with email: ${email}`);
      return undefined;
    } catch (error) {
      this.logger.error(`Error finding user with email: ${email}`, error.stack);
      throw new Error('Unable to retrieve user. Please try again later.');
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns An array of all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users`;
      const result = await this.pool.query(query);

      this.logger.log(`Retrieved ${result.rows.length} users`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error retrieving users', error.stack);
      throw new Error('Unable to fetch users. Please try again later.');
    }
  }
}
