// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './modules/tasks.module';
import { ProjectsModule } from './modules/projects.module';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { CommentsModule } from './modules/comments.module';
import { TaskLogsModule } from './modules/task-logs.module';
import { PubSubModule } from './modules/pubsub.module';

@Module({
  imports: [
    DatabaseModule,
    TasksModule,
    ProjectsModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    TaskLogsModule,
    PubSubModule,
  ],
})
export class AppModule {}
