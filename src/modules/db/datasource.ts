import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import entities from './entities';

dotenv.config();

export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: Number(process.env.POSTGRES_PORT),
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  entities: entities,
  migrations: ['dist/db/migrations/**/*.js'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceConfig);
export default dataSource;
