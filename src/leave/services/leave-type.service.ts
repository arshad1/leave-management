import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from '../entities/leave-type.entity';
import { CreateLeaveTypeDto } from '../dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from '../dto/update-leave-type.dto';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
    return this.leaveTypeRepository.save(leaveType);
  }

  async findAll(): Promise<LeaveType[]> {
    return this.leaveTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findAllIncludingInactive(): Promise<LeaveType[]> {
    return this.leaveTypeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID "${id}" not found`);
    }

    return leaveType;
  }

  async update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = await this.findOne(id);
    Object.assign(leaveType, updateLeaveTypeDto);
    return this.leaveTypeRepository.save(leaveType);
  }

  async remove(id: string): Promise<void> {
    const result = await this.leaveTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Leave type with ID "${id}" not found`);
    }
  }

  async toggleActive(id: string): Promise<LeaveType> {
    const leaveType = await this.findOne(id);
    leaveType.isActive = !leaveType.isActive;
    return this.leaveTypeRepository.save(leaveType);
  }
}