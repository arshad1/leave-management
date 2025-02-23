import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LeaveBalanceService } from '../services/leave-balance.service';
import { CreateLeaveBalanceDto } from '../dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from '../dto/update-leave-balance.dto';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@/users/entities/user.entity';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('Leave Balances')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave-balances')
export class LeaveBalanceController {
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new leave balance' })
  @ApiBody({
    description: 'Leave balance creation payload',
    type: CreateLeaveBalanceDto,
    examples: {
      example1: {
        value: {
          userId: "123e4567-e89b-12d3-a456-426614174000",
          leaveTypeId: "123e4567-e89b-12d3-a456-426614174001",
          year: 2024,
          totalDays: 25,
          remainingDays: 25,
          carryOverDays: 5
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Leave balance has been successfully created',
    type: LeaveBalance
  })
  create(@Body() createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<LeaveBalance> {
    return this.leaveBalanceService.create(createLeaveBalanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave balances' })
  @ApiResponse({
    status: 200,
    description: 'List of all leave balances',
    type: [LeaveBalance]
  })
  findAll(): Promise<LeaveBalance[]> {
    return this.leaveBalanceService.findAll();
  }

  @Get('my-balances')
  @ApiOperation({ summary: 'Get current user leave balances for a specific year' })
  @ApiQuery({ 
    name: 'year', 
    description: 'Year for leave balance',
    type: Number,
    example: 2024
  })
  @ApiResponse({
    status: 200,
    description: 'User leave balances for the specified year',
    type: [LeaveBalance]
  })
  findMyBalances(
    @CurrentUser() user: any,
    @Query('year') year: number,
  ): Promise<LeaveBalance[]> {
    return this.leaveBalanceService.findByUserAndYear(user.id, year);
  }

  @Get(':leaveTypeId/check-balance')
  @ApiOperation({ summary: 'Check if current user has sufficient leave balance' })
  @ApiParam({ name: 'leaveTypeId', description: 'Leave Type ID' })
  @ApiQuery({ 
    name: 'days', 
    description: 'Number of days to check',
    type: Number,
    example: 5
  })
  async checkMyBalance(
    @CurrentUser() user: any,
    @Param('leaveTypeId') leaveTypeId: string,
    @Query('days') requestedDays: number,
  ): Promise<{ available: boolean }> {
    const available = await this.leaveBalanceService.checkAvailableBalance(
      user.id,
      leaveTypeId,
      requestedDays,
    );
    return { available };
  }

  @Roles(UserRole.ADMIN)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user leave balances for a specific year' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ 
    name: 'year', 
    description: 'Year for leave balance',
    type: Number,
    example: 2024
  })
  @ApiResponse({
    status: 200,
    description: 'User leave balances for the specified year',
    type: [LeaveBalance]
  })
  findByUserAndYear(
    @Param('userId') userId: string,
    @Query('year') year: number,
  ): Promise<LeaveBalance[]> {
    return this.leaveBalanceService.findByUserAndYear(userId, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<LeaveBalance> {
    return this.leaveBalanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a leave balance' })
  @ApiBody({
    description: 'Leave balance update payload',
    type: UpdateLeaveBalanceDto,
    examples: {
      example1: {
        value: {
          remainingDays: 20,
          carryOverDays: 3,
          notes: "Adjusted after approved leave"
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Leave balance has been successfully updated',
    type: LeaveBalance
  })
  update(
    @Param('id') id: string,
    @Body() updateLeaveBalanceDto: UpdateLeaveBalanceDto,
  ): Promise<LeaveBalance> {
    return this.leaveBalanceService.update(id, updateLeaveBalanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.leaveBalanceService.remove(id);
  }

  @Get(':userId/:leaveTypeId/check-balance')
  @ApiOperation({ summary: 'Check if user has sufficient leave balance' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'leaveTypeId', description: 'Leave Type ID' })
  @ApiQuery({ 
    name: 'days', 
    description: 'Number of days to check',
    type: Number,
    example: 5
  })
  @ApiResponse({
    status: 200,
    description: 'Balance availability check result',
    schema: {
      type: 'object',
      properties: {
        available: {
          type: 'boolean',
          description: 'Whether requested days are available',
          example: true
        }
      }
    }
  })
  async checkAvailableBalance(
    @Param('userId') userId: string,
    @Param('leaveTypeId') leaveTypeId: string,
    @Query('days') requestedDays: number,
  ): Promise<{ available: boolean }> {
    const available = await this.leaveBalanceService.checkAvailableBalance(
      userId,
      leaveTypeId,
      requestedDays,
    );
    return { available };
  }
}