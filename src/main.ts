import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { PubSubService } from './services/pubsub.service'; // Import PubSubService

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Allow requests from the frontend
    credentials: true, // If cookies or credentials are required
  });

  // Connect to database
  const pool = app.get('PG_CONNECTION');
  await pool
    .connect()
    .then(() => console.log('Connected to database:', process.env.POSTGRES_DB))
    .catch((err) => console.error('Database connection error:', err));

  // Start listening for Pub/Sub messages
  const pubSubService = app.get(PubSubService); // Get PubSubService instance
  await pubSubService.listenForTaskNotifications(); // Start listening for messages

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Application is running on: ${process.env.PORT ?? 3000}`);
  });
}

bootstrap();
