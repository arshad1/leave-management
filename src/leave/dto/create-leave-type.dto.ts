import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  defaultDays: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @IsString()
  @IsOptional()
  colorCode?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxDaysPerRequest?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.5)
  minDaysPerRequest?: number;

  @IsBoolean()
  @IsOptional()
  allowHalfDay?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  noticeDaysRequired?: number;
}