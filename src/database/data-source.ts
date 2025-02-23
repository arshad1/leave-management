import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { LeaveType } from '../leave/entities/leave-type.entity';
import { LeaveBalance } from '../leave/entities/leave-balance.entity';
import { LeaveRequest } from '../leave/entities/leave-request.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432') || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, LeaveType, LeaveBalance, LeaveRequest, RefreshToken],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;