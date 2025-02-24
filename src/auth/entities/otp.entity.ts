import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('otps')
export class OTP extends BaseEntity {
  @Column()
  email: string;

  @Column()
  otp: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}