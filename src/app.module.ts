import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './modules/tasks.module';
@Module({
  imports: [DatabaseModule, TasksModule],
})
export class AppModule {}
