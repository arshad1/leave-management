import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LeaveModule } from './leave/leave.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { User } from './users/entities/user.entity';
import { LeaveType } from './leave/entities/leave-type.entity';
import { LeaveBalance } from './leave/entities/leave-balance.entity';
import { LeaveRequest } from './leave/entities/leave-request.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    LeaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
