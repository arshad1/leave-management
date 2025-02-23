import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaveRequestDto {
  @IsString()
  @IsNotEmpty()
  leaveTypeId: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @Min(0.5)
  days: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @IsString()
  @IsOptional()
  comments?: string;

  // The following fields will be set by the system
  userId?: string; // Set from authenticated user
  status?: string; // Set to 'pending' by default
}