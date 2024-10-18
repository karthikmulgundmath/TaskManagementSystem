import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './modules/tasks.module';
import { ProjectsModule } from './modules/projects.module'; // Import ProjectsModule
import { UsersModule } from './modules/users.module'; // New users module
import { AuthModule } from './modules/auth.module'; // New auth module
@Module({
  imports: [
    DatabaseModule,
    TasksModule,
    ProjectsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
