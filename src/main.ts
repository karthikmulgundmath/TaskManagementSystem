import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseModule } from './database/database.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect to database
  const pool = app.get('PG_CONNECTION');
  await pool.connect();

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Application is running on: ${process.env.PORT} || 3000`);
  });
}

bootstrap();
