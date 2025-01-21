import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './otp.entity';

@Injectable()
export class OTPService {
    constructor(
        @InjectRepository(OTP)
        private otpRepository: Repository<OTP>,
    ) { }

    private async sendViaVendor(phoneNumber: string, vendor: string): Promise<boolean> {
        // منطق محاكاة لإرسال OTP عبر بائع معين
        const success = Math.random() > 0.3; // افتراض نسبة نجاح 70%
        console.log(`Trying ${vendor} for ${phoneNumber}... Success: ${success}`);
        return success;
    }

    async sendOTP(phoneNumber: string): Promise<string> {
        const vendors = ['VendorA', 'VendorB']; // قائمة البائعين
        let success = false;

        for (const vendor of vendors) {
            const otp = this.otpRepository.create({
                phoneNumber,
                vendor,
            });
            await this.otpRepository.save(otp);

            success = await this.sendViaVendor(phoneNumber, vendor);
            if (success) {
                otp.status = 'sent';
                await this.otpRepository.save(otp);
                return `OTP sent successfully via ${vendor}`;
            } else {
                otp.status = 'failed';
                await this.otpRepository.save(otp);
            }
        }

        throw new Error('Failed to send OTP via all vendors');
    }
}
