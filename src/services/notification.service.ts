import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

@Injectable()
export class NotificationService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  async sendNotificationToUser(data: any): Promise<void> {
    const { userId, taskTitle, dueDate, projectId } = data;

    console.log(
      `Sending notification to user ${userId} about task ${taskTitle}.`,
    );

    try {
      // Get user details
      const userQuery = 'SELECT name, email FROM users WHERE id = $1';
      const userResult = await this.pool.query(userQuery, [userId]);
      const user = userResult.rows[0];

      if (!user) {
        throw new BadRequestException('User not found.');
      }

      // Get project details
      const projectQuery = 'SELECT name FROM projects WHERE id = $1';
      const projectResult = await this.pool.query(projectQuery, [projectId]);
      const project = projectResult.rows[0];

      if (!project) {
        throw new BadRequestException('Project not found.');
      }

      // Compose email message
      const message = `Dear ${user.name},

      You have been assigned the task "${taskTitle}" in the project "${project.name}". 
      The due date is ${new Date(dueDate).toLocaleString()}.

      Best regards,
      Your Task Management Team
      `;

      // Send email using Nodemailer
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODE_MAILER_EMAIL, // Your email
          pass: process.env.NODE_MAILER_PASSWORD, // App Password from Google
        },
      });

      const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: user.email,
        subject: `New Task Assigned: ${taskTitle}`,
        text: message,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Notification sent to ${user.email}.`);

      // Insert notification into the database
      const notificationQuery = `
        INSERT INTO notifications (id, user_id, task_id, message, created_at) 
        VALUES ($1, $2, $3, $4, $5)
      `;
      const notificationValues = [
        uuidv4(), // Generate a unique ID for the notification
        userId, // user_id
        data.taskId, // task_id (make sure taskId is part of the data passed to this function)
        message, // message
        new Date(), // created_at (current date and time)
      ];

      await this.pool.query(notificationQuery, notificationValues);
      console.log(`Notification saved to database for user ${userId}.`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
