import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from '@modules/db/datasource';
import { DataSource } from 'typeorm';
import AuthModule from '@modules/auth/auth.module';
import UserModule from '@modules/user/user.module';
import LogModule from '@modules/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceConfig),
    AuthModule,
    UserModule,
    LogModule,
  ],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) {}
}
