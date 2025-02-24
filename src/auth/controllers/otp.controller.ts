import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OtpService } from '../services/otp.service';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  async sendOTP(@Body('email') email: string) {
    return this.otpService.sendOTP(email);
  }

  @Post('verify')
  async verifyOTP(@Body() body: { email: string; otp: string }) {
    return this.otpService.verifyOTP(body.email, body.otp);
  }
}