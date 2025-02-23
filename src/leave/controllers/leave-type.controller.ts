import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@/users/entities/user.entity';
import { LeaveTypeService } from '../services/leave-type.service';
import { CreateLeaveTypeDto } from '../dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from '../dto/update-leave-type.dto';
import { LeaveType } from '../entities/leave-type.entity';

@ApiBearerAuth()
@ApiTags('Leave Types')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave-types')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave type' })
  @ApiBody({
    description: 'Leave type creation payload',
    type: CreateLeaveTypeDto,
    examples: {
      example1: {
        value: {
          name: "Annual Leave",
          description: "Regular annual leave allocation",
          defaultDays: 20,
          isActive: true,
          requiresApproval: true,
          colorCode: "#4CAF50",
          maxDaysPerRequest: 10,
          minDaysPerRequest: 0.5,
          allowHalfDay: true,
          noticeDaysRequired: 7
        }
      }
    }
  }) 
  
  @ApiResponse({
    status: 201,
    description: 'Leave type has been successfully created',
    type: LeaveType
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  create(@Body() createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
    return this.leaveTypeService.create(createLeaveTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active leave types' })
  @ApiResponse({
    status: 200,
    description: 'List of active leave types',
    type: [LeaveType]
  })
  findAll(): Promise<LeaveType[]> {
    return this.leaveTypeService.findAll();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all leave types including inactive ones' })
  @ApiResponse({
    status: 200,
    description: 'List of all leave types',
    type: [LeaveType]
  })
  findAllIncludingInactive(): Promise<LeaveType[]> {
    return this.leaveTypeService.findAllIncludingInactive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a leave type by id' })
  @ApiResponse({
    status: 200,
    description: 'The leave type',
    type: LeaveType
  })
  @ApiResponse({ status: 404, description: 'Leave type not found' })
  findOne(@Param('id') id: string): Promise<LeaveType> {
    return this.leaveTypeService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a leave type' })
  @ApiBody({
    description: 'Leave type update payload',
    type: UpdateLeaveTypeDto,
    examples: {
      example1: {
        value: {
          description: "Updated annual leave description",
          defaultDays: 25,
          requiresApproval: true,
          maxDaysPerRequest: 15
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Leave type has been successfully updated',
    type: LeaveType
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiResponse({ status: 404, description: 'Leave type not found' })
  update(
    @Param('id') id: string,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto,
  ): Promise<LeaveType> {
    return this.leaveTypeService.update(id, updateLeaveTypeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a leave type' })
  @ApiResponse({
    status: 204,
    description: 'Leave type has been successfully deleted'
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiResponse({ status: 404, description: 'Leave type not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.leaveTypeService.remove(id);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle leave type active status' })
  @ApiBody({
    description: 'Toggle leave type active status',
    schema: {
      type: 'object',
      properties: {
        isActive: {
          type: 'boolean',
          description: 'The new active status',
          example: false
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Leave type active status has been toggled',
    type: LeaveType
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiResponse({ status: 404, description: 'Leave type not found' })
  toggleActive(@Param('id') id: string): Promise<LeaveType> {
    return this.leaveTypeService.toggleActive(id);
  }
}
