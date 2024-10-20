import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { PubSubService } from './services/pubsub.service'; // Import PubSubService

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect to database
  const pool = app.get('PG_CONNECTION');
  await pool
    .connect()
    .then(() => console.log('Connected to database:', process.env.POSTGRES_DB));

  // Start listening for Pub/Sub messages
  const pubSubService = app.get(PubSubService); // Get PubSubService instance
  await pubSubService.listenForTaskNotifications(); // Start listening for messages

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Application is running on: ${process.env.PORT ?? 3000}`);
  });
}

bootstrap();
