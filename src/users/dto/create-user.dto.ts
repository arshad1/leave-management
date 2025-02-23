import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ 
    example: 'Password123!',
    description: 'User password - minimum 6 characters',
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ 
    enum: UserRole,
    default: UserRole.EMPLOYEE,
    description: 'User role in the system' 
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Department ID the user belongs to'
  })
  @IsString()
  @IsOptional()
  departmentId?: string;
}