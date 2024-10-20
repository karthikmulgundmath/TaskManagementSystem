// notification.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import * as nodemailer from 'nodemailer';

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
      const message = `
        Dear ${user.name},

        You have been assigned the task "${taskTitle}" in the project "${project.name}". 
        The due date is ${new Date(dueDate).toLocaleString()}.

        Best regards,
        Your Task Management Team
      `;

      // Send email using Nodemailer
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Disable secure connection (SSL)
        auth: {
          user: process.env.NODE_MAILER_EMAIL, // Your email
          pass: process.env.NODE_MAILER_PASSWORD, // App Password from Google
        },
      });
      console.log('transporter', transporter);

      const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL, // Sender address
        to: user.email, // Recipient address
        subject: `New Task Assigned: ${taskTitle}`, // Subject line
        text: message, // Plain text body
      };
      console.log('mailOptions', mailOptions);

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Notification sent to ${user.email}.`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
