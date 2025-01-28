import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OTPService } from './otp.service';

@Controller('otp')
export class OTPController {
    constructor(private readonly otpService: OTPService) { }

    @Post('send')
    async sendOTP(@Body('phoneNumber') phoneNumber: string): Promise<string> {
        try {
            return await this.otpService.sendOTP(phoneNumber);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('verify')
    async verifyOTP(@Body('phoneNumber') phoneNumber: string, @Body('code') code: string, @Body('vendor') vendor: string): Promise<boolean> {
        try {
            return await this.otpService.verifyOTP(phoneNumber, code, vendor);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }
}