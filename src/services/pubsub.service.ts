import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService implements OnModuleInit {
  private pubSubClient: PubSub;

  constructor() {
    console.log(
      'Initializing Pub/Sub client with Project ID:',
      process.env.PROJECT_ID,
    );
    this.pubSubClient = new PubSub({
      projectId: process.env.PROJECT_ID,
    }); // Initialize Pub/Sub client
  }

  async onModuleInit() {
    // This will automatically start listening to the subscription on module init
    await this.listenForTaskNotifications();
  }

  async listenForTaskNotifications() {
    // Correctly set the subscription name
    const subscriptionName = `projects/${process.env.PROJECT_ID}/subscriptions/${process.env.SUBSCRIPTION_NAME}`;
    console.log('subscriptionName', subscriptionName);

    const subscription = this.pubSubClient.subscription(subscriptionName);

    // Listen for new messages
    subscription.on('message', async (message) => {
      const data = JSON.parse(message.data.toString());
      console.log(
        `Received notification for task: ${data.taskTitle}, assigned to user: ${data.userId}, due on: ${data.dueDate}`,
      );

      // Add logic to send notification to user, e.g., email, push notification
      await this.sendNotificationToUser(data);

      // Acknowledge message
      message.ack();
    });

    // Handle errors
    subscription.on('error', (error) => {
      console.error('Error receiving Pub/Sub message:', error);
    });
  }

  private async sendNotificationToUser(data: any): Promise<void> {
    console.log(
      `Sending notification to user ${data.userId} about task ${data.taskTitle}.`,
    );
  }
}
