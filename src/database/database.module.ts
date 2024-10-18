import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async () => {
        const pool = new Pool({
          user: process.env.POSTGRES_USER,
          host: process.env.POSTGRES_HOST,
          database: process.env.POSTGRES_DB,
          password: String(process.env.POSTGRES_PASSWORD),
          port: parseInt(process.env.POSTGRES_PORT, 10),
        });
        return pool;
      },
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}
