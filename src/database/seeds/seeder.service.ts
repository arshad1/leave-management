import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { LeaveType } from '../../leave/entities/leave-type.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedLeaveTypes();
  }

  private async seedUsers() {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      const admin = this.userRepository.create({
        email: 'admin@example.com',
        password: 'Admin123!',
        firstName: 'System',
        lastName: 'Admin',
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(admin);
    }
  }

  private async seedLeaveTypes() {
    const defaultLeaveTypes = [
      {
        name: 'Annual Leave',
        description: 'Regular paid vacation leave',
        defaultDays: 20,
        colorCode: '#4CAF50',
        isActive: true,
        requiresApproval: true,
        maxDaysPerRequest: 15,
        minDaysPerRequest: 0.5,
        allowHalfDay: true,
        noticeDaysRequired: 5,
      },
      {
        name: 'Sick Leave',
        description: 'Leave for medical reasons',
        defaultDays: 12,
        colorCode: '#F44336',
        isActive: true,
        requiresApproval: true,
        maxDaysPerRequest: 5,
        minDaysPerRequest: 0.5,
        allowHalfDay: true,
        noticeDaysRequired: 0,
      },
      {
        name: 'Personal Leave',
        description: 'Leave for personal matters',
        defaultDays: 5,
        colorCode: '#2196F3',
        isActive: true,
        requiresApproval: true,
        maxDaysPerRequest: 3,
        minDaysPerRequest: 0.5,
        allowHalfDay: true,
        noticeDaysRequired: 2,
      },
    ];

    for (const leaveType of defaultLeaveTypes) {
      const exists = await this.leaveTypeRepository.findOne({
        where: { name: leaveType.name },
      });

      if (!exists) {
        await this.leaveTypeRepository.save(
          this.leaveTypeRepository.create(leaveType),
        );
      }
    }
  }
}