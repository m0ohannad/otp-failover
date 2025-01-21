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

    async sendOTP(phoneNumber: string): Promise<string> {
        // افتراضيًا، أرسل عبر Vendor A
        const vendor = 'VendorA';

        const otp = this.otpRepository.create({
            phoneNumber,
            vendor,
        });

        await this.otpRepository.save(otp);

        // منطق الاتصال بـ Vendor A (محاكاة)
        const success = Math.random() > 0.2; // افتراض نسبة نجاح 80%
        if (!success) {
            otp.status = 'failed';
            await this.otpRepository.save(otp);
            throw new Error('Failed to send OTP via Vendor A');
        }

        otp.status = 'sent';
        await this.otpRepository.save(otp);

        return 'OTP sent successfully via Vendor A';
    }
}
