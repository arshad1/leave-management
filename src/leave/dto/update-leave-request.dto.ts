import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateLeaveRequestDto } from './create-leave-request.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeaveRequestStatus } from '../entities/leave-request.entity';

export class UpdateLeaveRequestDto extends PartialType(
  OmitType(CreateLeaveRequestDto, ['userId'] as const),
) {
  @IsEnum(LeaveRequestStatus)
  @IsOptional()
  status?: LeaveRequestStatus;
}

export class ApproveLeaveRequestDto {
  @IsString()
  @IsOptional()
  comments?: string;
}

export class RejectLeaveRequestDto {
  @IsString()
  rejectionReason: string;

  @IsString()
  @IsOptional()
  comments?: string;
}

export class CancelLeaveRequestDto {
  @IsString()
  cancelledReason: string;

  @IsString()
  @IsOptional()
  comments?: string;
}