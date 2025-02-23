import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { LeaveType } from '../../leave/entities/leave-type.entity';
import { SeederService } from './seeder.service';
import configuration from '../../config/configuration';
import { dataSourceOptions } from '../data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, LeaveType]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}