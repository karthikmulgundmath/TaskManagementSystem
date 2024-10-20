import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './modules/tasks.module';
import { ProjectsModule } from './modules/projects.module'; // Import ProjectsModule
import { UsersModule } from './modules/users.module'; // New users module
import { AuthModule } from './modules/auth.module'; // New auth module
import { CommentsModule } from './modules/comments.module'; // Import CommentsModule
import { TaskLogsModule } from './modules/task-logs.module'; // Import TaskLogsModule
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
