import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from '../entities/otp.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly mailerService: MailerService,
  ) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string) {
    // Generate a 6 digit OTP
    const otp = this.generateOTP();
    
    // Set expiration time to 5 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Save OTP to database
    const otpEntity = this.otpRepository.create({
      email,
      otp,
      expiresAt,
      isVerified: false,
    });
    await this.otpRepository.save(otpEntity);

    // Send OTP via email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
    });

    return { message: 'OTP sent successfully' };
  }

  async verifyOTP(email: string, otp: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { email, otp, isVerified: false },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Mark OTP as verified
    otpRecord.isVerified = true;
    await this.otpRepository.save(otpRecord);

    return { message: 'OTP verified successfully' };
  }
}