import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { LeaveRequest, LeaveRequestStatus } from '../entities/leave-request.entity';
import { CreateLeaveRequestDto } from '../dto/create-leave-request.dto';
import { UpdateLeaveRequestDto, ApproveLeaveRequestDto, RejectLeaveRequestDto, CancelLeaveRequestDto } from '../dto/update-leave-request.dto';
import { LeaveBalanceService } from './leave-balance.service';
import { LeaveTypeService } from './leave-type.service';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    private readonly leaveBalanceService: LeaveBalanceService,
    private readonly leaveTypeService: LeaveTypeService,
  ) {}

  async create(userId: string, createLeaveRequestDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    // Validate dates
    if (createLeaveRequestDto.startDate > createLeaveRequestDto.endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    // Validate leave balance
    const hasBalance = await this.leaveBalanceService.checkAvailableBalance(
      userId,
      createLeaveRequestDto.leaveTypeId,
      createLeaveRequestDto.days,
    );

    if (!hasBalance) {
      throw new BadRequestException('Insufficient leave balance');
    }

    // Check for existing leave requests in the date range
    const existingRequests = await this.leaveRequestRepository.find({
      where: {
        userId,
        status: LeaveRequestStatus.PENDING || LeaveRequestStatus.APPROVED,
        startDate: Between(createLeaveRequestDto.startDate, createLeaveRequestDto.endDate),
        endDate: Between(createLeaveRequestDto.startDate, createLeaveRequestDto.endDate),
      },
    });

    if (existingRequests.length > 0) {
      throw new BadRequestException('You already have a leave request for these dates');
    }

    const leaveRequest = this.leaveRequestRepository.create({
      ...createLeaveRequestDto,
      userId,
      status: LeaveRequestStatus.PENDING,
    });

    await this.leaveRequestRepository.save(leaveRequest);

    // Update pending days in leave balance
    await this.updateLeaveBalance(userId, createLeaveRequestDto.leaveTypeId);

    return this.findOne(leaveRequest.id);
  }

  async findAll(): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      relations: ['user', 'leaveType', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ['user', 'leaveType', 'approver'],
    });

    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID "${id}" not found`);
    }

    return leaveRequest;
  }

  async findByUser(userId: string): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: { userId },
      relations: ['leaveType', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async approve(
    id: string,
    approverId: string,
    approveDto: ApproveLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Can only approve pending leave requests');
    }

    leaveRequest.status = LeaveRequestStatus.APPROVED;
    leaveRequest.approvedBy = approverId;

    await this.leaveRequestRepository.save(leaveRequest);
    await this.updateLeaveBalance(leaveRequest.userId, leaveRequest.leaveTypeId);

    return this.findOne(id);
  }

  async reject(
    id: string,
    approverId: string,
    rejectDto: RejectLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Can only reject pending leave requests');
    }

    leaveRequest.status = LeaveRequestStatus.REJECTED;
    leaveRequest.approvedBy = approverId;
    leaveRequest.rejectionReason = rejectDto.rejectionReason;

    await this.leaveRequestRepository.save(leaveRequest);
    await this.updateLeaveBalance(leaveRequest.userId, leaveRequest.leaveTypeId);

    return this.findOne(id);
  }

  async cancel(
    id: string,
    userId: string,
    cancelDto: CancelLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);

    if (leaveRequest.userId !== userId) {
      throw new ForbiddenException('Cannot cancel leave request of another user');
    }

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending leave requests');
    }

    leaveRequest.status = LeaveRequestStatus.CANCELLED;
    leaveRequest.cancelledReason = cancelDto.cancelledReason;
    leaveRequest.cancelledAt = new Date();

    await this.leaveRequestRepository.save(leaveRequest);
    await this.updateLeaveBalance(leaveRequest.userId, leaveRequest.leaveTypeId);

    return this.findOne(id);
  }

  private async updateLeaveBalance(userId: string, leaveTypeId: string): Promise<void> {
    const requests = await this.leaveRequestRepository.find({
      where: {
        userId,
        leaveTypeId,
        status: In([LeaveRequestStatus.APPROVED, LeaveRequestStatus.PENDING]),
      },
    });

    const usedDays = requests
      .filter(req => req.status === LeaveRequestStatus.APPROVED)
      .reduce((sum, req) => sum + req.days, 0);

    const pendingDays = requests
      .filter(req => req.status === LeaveRequestStatus.PENDING)
      .reduce((sum, req) => sum + req.days, 0);

    await this.leaveBalanceService.updateBalance(
      userId,
      leaveTypeId,
      new Date().getFullYear(),
      usedDays,
      pendingDays,
    );
  }
}