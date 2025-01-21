import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './otp.entity';

@Injectable()
export class OTPService {
    private readonly logger = new Logger(OTPService.name); // Logger خاص بالخدمة

    constructor(
        @InjectRepository(OTP)
        private otpRepository: Repository<OTP>,
    ) { }

    private async sendViaVendor(phoneNumber: string, vendor: string): Promise<boolean> {
        // منطق محاكاة لإرسال OTP عبر بائع معين
        const success = Math.random() > 0.3; // افتراض نسبة نجاح 70%
        this.logger.log(`Attempting to send OTP to ${phoneNumber} via ${vendor}...`);
        this.logger.debug(`Vendor: ${vendor}, Success Simulation: ${success}`);
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

            this.logger.log(`Trying vendor: ${vendor} for phone number: ${phoneNumber}`);

            success = await this.sendViaVendor(phoneNumber, vendor);
            if (success) {
                otp.status = 'sent';
                await this.otpRepository.save(otp);
                this.logger.log(`OTP sent successfully via ${vendor} for ${phoneNumber}`);
                return `OTP sent successfully via ${vendor}`;
            } else {
                otp.status = 'failed';
                await this.otpRepository.save(otp);
                this.logger.warn(`Failed to send OTP via ${vendor} for ${phoneNumber}`);
            }
        }

        this.logger.error(`Failed to send OTP for ${phoneNumber} using all vendors`);
        throw new Error('Failed to send OTP via all vendors');
    }
}
