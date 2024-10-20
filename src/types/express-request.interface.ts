import { Request } from 'express';
import { User } from 'src/entities/user.entity'; // Assuming you have a User entity

export interface AuthenticatedRequest extends Request {
  user?: User; // Assuming user is an instance of the User entity
}
