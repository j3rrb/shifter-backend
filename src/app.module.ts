import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from '@modules/db/datasource';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceConfig)],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) {}
}
