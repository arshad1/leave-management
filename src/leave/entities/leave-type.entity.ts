import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('leave_types')
export class LeaveType extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'default_days' })
  defaultDays: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'requires_approval', default: true })
  requiresApproval: boolean;

  @Column({ name: 'color_code', nullable: true })
  colorCode: string;

  @Column({ name: 'max_days_per_request', type: 'decimal', precision: 3, scale: 1, nullable: true })
  maxDaysPerRequest: number;

  @Column({ name: 'min_days_per_request', type: 'decimal', precision: 3, scale: 1, default: 0.5 })
  minDaysPerRequest: number;

  @Column({ name: 'allow_half_day', default: true })
  allowHalfDay: boolean;

  @Column({ name: 'notice_days_required', default: 0 })
  noticeDaysRequired: number;
}