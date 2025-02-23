import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { CreateLeaveBalanceDto } from '../dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from '../dto/update-leave-balance.dto';

@Injectable()
export class LeaveBalanceService {
  constructor(
    @InjectRepository(LeaveBalance)
    private readonly leaveBalanceRepository: Repository<LeaveBalance>,
  ) {}

  async create(createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<LeaveBalance> {
    // Check if balance already exists for user, leave type and year
    const existing = await this.leaveBalanceRepository.findOne({
      where: {
        userId: createLeaveBalanceDto.userId,
        leaveTypeId: createLeaveBalanceDto.leaveTypeId,
        year: createLeaveBalanceDto.year,
      },
    });

    if (existing) {
      throw new BadRequestException('Leave balance already exists for this user, leave type and year');
    }

    const leaveBalance = this.leaveBalanceRepository.create(createLeaveBalanceDto);
    return this.leaveBalanceRepository.save(leaveBalance);
  }

  async findAll(): Promise<LeaveBalance[]> {
    return this.leaveBalanceRepository.find({
      relations: ['user', 'leaveType'],
    });
  }

  async findOne(id: string): Promise<LeaveBalance> {
    const leaveBalance = await this.leaveBalanceRepository.findOne({
      where: { id },
      relations: ['user', 'leaveType'],
    });

    if (!leaveBalance) {
      throw new NotFoundException(`Leave balance with ID "${id}" not found`);
    }

    return leaveBalance;
  }

  async findByUserAndYear(userId: string, year: number): Promise<LeaveBalance[]> {
    return this.leaveBalanceRepository.find({
      where: { userId, year },
      relations: ['leaveType'],
    });
  }

  async checkAvailableBalance(
    userId: string,
    leaveTypeId: string,
    requestedDays: number,
  ): Promise<boolean> {
    const balance = await this.leaveBalanceRepository.findOne({
      where: {
        userId,
        leaveTypeId,
        year: new Date().getFullYear(),
      },
    });

    if (!balance) {
      throw new NotFoundException('Leave balance not found');
    }

    return balance.totalAvailableDays >= requestedDays;
  }

  async update(id: string, updateLeaveBalanceDto: UpdateLeaveBalanceDto): Promise<LeaveBalance> {
    const leaveBalance = await this.findOne(id);
    Object.assign(leaveBalance, updateLeaveBalanceDto);
    return this.leaveBalanceRepository.save(leaveBalance);
  }

  async updateBalance(
    userId: string,
    leaveTypeId: string,
    year: number,
    usedDays: number,
    pendingDays: number,
  ): Promise<LeaveBalance> {
    const balance = await this.leaveBalanceRepository.findOne({
      where: { userId, leaveTypeId, year },
    });

    if (!balance) {
      throw new NotFoundException('Leave balance not found');
    }

    balance.usedDays = usedDays;
    balance.pendingDays = pendingDays;

    return this.leaveBalanceRepository.save(balance);
  }

  async remove(id: string): Promise<void> {
    const result = await this.leaveBalanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Leave balance with ID "${id}" not found`);
    }
  }
}