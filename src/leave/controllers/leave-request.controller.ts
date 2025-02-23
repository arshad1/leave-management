import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { LeaveRequestService } from '../services/leave-request.service';
import { CreateLeaveRequestDto } from '../dto/create-leave-request.dto';
import { User } from '../../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: Omit<User, 'password'>;
}
import { 
  ApproveLeaveRequestDto,
  RejectLeaveRequestDto,
  CancelLeaveRequestDto,
} from '../dto/update-leave-request.dto';
import { LeaveRequest } from '../entities/leave-request.entity';
import { UserRole } from '../../users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Leave Requests')
@UseGuards(JwtAuthGuard)
@Controller('leave-requests')
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.leaveRequestService.create(req.user.id, createLeaveRequestDto);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<LeaveRequest[]> {
    if (req.user.role === UserRole.ADMIN) {
      return this.leaveRequestService.findAll();
    }
    return this.leaveRequestService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Req() req: RequestWithUser, @Param('id') id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestService.findOne(id);
    
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.id !== leaveRequest.userId
    ) {
      throw new ForbiddenException('You cannot view this leave request');
    }
    
    return leaveRequest;
  }

  @Post(':id/approve')
  approve(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() approveDto: ApproveLeaveRequestDto,
  ): Promise<LeaveRequest> {
    if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.MANAGER) {
      throw new ForbiddenException('You are not authorized to approve leave requests');
    }
    return this.leaveRequestService.approve(id, req.user.id, approveDto);
  }

  @Post(':id/reject')
  reject(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() rejectDto: RejectLeaveRequestDto,
  ): Promise<LeaveRequest> {
    if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.MANAGER) {
      throw new ForbiddenException('You are not authorized to reject leave requests');
    }
    return this.leaveRequestService.reject(id, req.user.id, rejectDto);
  }

  @Post(':id/cancel')
  cancel(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() cancelDto: CancelLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.leaveRequestService.cancel(id, req.user.id, cancelDto);
  }

  @Get('user/:userId')
  async findByUser(@Req() req: RequestWithUser, @Param('userId') userId: string): Promise<LeaveRequest[]> {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('You cannot view leave requests of other users');
    }
    return this.leaveRequestService.findByUser(userId);
  }
}