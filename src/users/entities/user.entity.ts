import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as bcryptjs from 'bcryptjs';
import { BaseEntity } from '../../common/entities/base.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @Column()
  lastName: string;

  @ApiProperty({ example: 'johndoe', description: 'Telegram username' })
  @Column({ nullable: true, unique: true })
  telegramUsername: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ 
    enum: UserRole,
    default: UserRole.EMPLOYEE,
    example: UserRole.EMPLOYEE,
    description: 'User role in the system'
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @ApiPropertyOptional({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Department ID the user belongs to'
  })
  @Column({ nullable: true })
  departmentId: string;

  @ApiProperty({ example: '2025-02-23T10:42:00Z', description: 'User creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-02-23T10:42:00Z', description: 'User last update date' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcryptjs.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password);
  }
}