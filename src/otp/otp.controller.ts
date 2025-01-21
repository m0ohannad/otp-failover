import { Controller, Post, Body } from '@nestjs/common';
import { OTPService } from './otp.service';

@Controller('otp')
export class OTPController {
    constructor(private readonly otpService: OTPService) { }

    @Post('send')
    async sendOTP(@Body('phoneNumber') phoneNumber: string): Promise<string> {
        return this.otpService.sendOTP(phoneNumber);
    }
}
