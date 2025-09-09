import { join } from 'node:path';

import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { ENV } from './env.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: ENV.DATABASE.HOST,
  port: ENV.DATABASE.PORT,
  username: ENV.DATABASE.UID,
  password: ENV.DATABASE.PWD,
  database: ENV.DATABASE.NAME,
  entities: [join(__dirname, './../entities/*.entity.{js,ts}')],
  logging: false,
  synchronize: ENV.DATABASE.SYNC,
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
