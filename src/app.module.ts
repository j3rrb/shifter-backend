import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from '@modules/db/datasource';
import { DataSource } from 'typeorm';
import AuthModule from '@modules/auth/auth.module';
import UserModule from '@modules/user/user.module';
import LogModule from '@modules/log/log.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceConfig),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    AuthModule,
    UserModule,
    LogModule,
  ],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) {}
}
