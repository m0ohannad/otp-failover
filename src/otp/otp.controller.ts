import { Controller, Post, Body } from '@nestjs/common';
import { OTPService } from './otp.service';

@Controller('otp')
export class OTPController {
    constructor(private readonly otpService: OTPService) { }

    @Post('send')
    async sendOTP(@Body('phoneNumber') phoneNumber: string): Promise<string> {
        return this.otpService.sendOTP(phoneNumber);
    }

    @Post('verify')
    async verifyOTP(@Body('phoneNumber') phoneNumber: string, @Body('code') code: string, @Body('vendor') vendor: string): Promise<boolean> {
        if (vendor === 'VendorA' || vendor === 'VendorB') {
            return this.otpService.verifyOTP(phoneNumber, code, vendor);
        } else {
            return this.otpService.verifyVendorOTP(phoneNumber, code);
        }
    }
}
