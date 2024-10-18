import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async () => {
        const pool = new Pool({
          user: process.env.POSTGRESQL_USERNAME,
          host: process.env.POSTGRESQL_HOST,
          database: process.env.POSTGRESQL_DATABASE,
          password: String(process.env.POSTGRESQL_PASSWORD),
          port: parseInt(process.env.POSTGRESQL_PORT, 10),
        });
        return pool;
      },
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}
