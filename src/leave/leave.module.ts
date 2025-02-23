import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { LeaveType } from './entities/leave-type.entity';
import { LeaveBalance } from './entities/leave-balance.entity';
import { LeaveRequest } from './entities/leave-request.entity';

// Services
import { LeaveTypeService } from './services/leave-type.service';
import { LeaveBalanceService } from './services/leave-balance.service';
import { LeaveRequestService } from './services/leave-request.service';

// Controllers
import { LeaveTypeController } from './controllers/leave-type.controller';
import { LeaveBalanceController } from './controllers/leave-balance.controller';
import { LeaveRequestController } from './controllers/leave-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeaveType,
      LeaveBalance,
      LeaveRequest,
    ]),
  ],
  providers: [
    LeaveTypeService,
    LeaveBalanceService,
    LeaveRequestService,
  ],
  controllers: [
    LeaveTypeController,
    LeaveBalanceController,
    LeaveRequestController,
  ],
  exports: [
    LeaveTypeService,
    LeaveBalanceService,
    LeaveRequestService,
  ],
})
export class LeaveModule {}