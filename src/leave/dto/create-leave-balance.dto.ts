import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateLeaveBalanceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  leaveTypeId: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @Min(0)
  totalDays: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  usedDays?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  pendingDays?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  carriedForwardDays?: number;
}