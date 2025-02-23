import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { LeaveType } from './leave-type.entity';

@Entity('leave_balances')
export class LeaveBalance extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'leave_type_id' })
  leaveTypeId: string;

  @Column()
  year: number;

  @Column({ name: 'total_days', type: 'decimal', precision: 5, scale: 1 })
  totalDays: number;

  @Column({ name: 'used_days', type: 'decimal', precision: 5, scale: 1, default: 0 })
  usedDays: number;

  @Column({ name: 'pending_days', type: 'decimal', precision: 5, scale: 1, default: 0 })
  pendingDays: number;

  @Column({ name: 'carried_forward_days', type: 'decimal', precision: 5, scale: 1, default: 0 })
  carriedForwardDays: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => LeaveType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;

  get availableDays(): number {
    return this.totalDays - this.usedDays - this.pendingDays;
  }

  get totalAvailableDays(): number {
    return this.totalDays + this.carriedForwardDays - this.usedDays - this.pendingDays;
  }
}