import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './otp.entity';
import * as Twilio from 'twilio';

@Injectable()
export class OTPService {
    private readonly logger = new Logger(OTPService.name);

    constructor(
        @InjectRepository(OTP)
        private otpRepository: Repository<OTP>,
    ) { }

    private async sendViaTwilio(phoneNumber: string, vendor: string): Promise<boolean> {
        let client: Twilio.Twilio;
        let verifyServiceSid: string;

        // اختيار بيانات الاتصال حسب البائع
        if (vendor === 'VendorA') {
            client = Twilio(
                process.env.TWILIO_A_ACCOUNT_SID,
                process.env.TWILIO_A_AUTH_TOKEN,
            );
            verifyServiceSid = process.env.TWILIO_A_VERIFY_SERVICE_SID;
        } else if (vendor === 'VendorB') {
            client = Twilio(
                process.env.TWILIO_B_ACCOUNT_SID,
                process.env.TWILIO_B_AUTH_TOKEN,
            );
            verifyServiceSid = process.env.TWILIO_B_VERIFY_SERVICE_SID;
        } else {
            this.logger.error(`Unknown vendor: ${vendor}`);
            throw new Error(`Unknown vendor: ${vendor}`);
        }

        try {
            this.logger.log(`Attempting to send OTP to ${phoneNumber} via ${vendor}...`);
            const response = await client.verify.services(verifyServiceSid).verifications.create({
                to: phoneNumber,
                channel: 'sms',
            });
            this.logger.log(`OTP sent via ${vendor}: SID=${response.sid}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send OTP via ${vendor}: ${error.message}`);
            return false;
        }
    }

    private async sendViaVendor(phoneNumber: string, vendor: string): Promise<boolean> {
        // منطق محاكاة لإرسال OTP عبر بائع معين
        const success = Math.random() > 0.3; // افتراض نسبة نجاح 70%
        this.logger.log(`Attempting to send OTP to ${phoneNumber} via ${vendor}...`);
        this.logger.debug(`Vendor: ${vendor}, Success Simulation: ${success}`);
        return success;
    }

    async sendOTP(phoneNumber: string, isTest: boolean = false): Promise<string> {
        const vendors = ['VendorA', 'VendorB']; // قائمة البائعين
        let success = false;

        for (const vendor of vendors) {
            const otp = this.otpRepository.create({
                phoneNumber,
                vendor,
            });
            await this.otpRepository.save(otp);

            this.logger.log(`Trying vendor: ${vendor} for phone number: ${phoneNumber}`);

            if (isTest) {
                success = await this.sendViaVendor(phoneNumber, vendor); // لاختبار محاكاة الفشل
            } else {
                success = await this.sendViaTwilio(phoneNumber, vendor); // لإرسال الرسالة الفعلية
            }

            if (success) {
                otp.status = 'sent';
                await this.otpRepository.save(otp);
                this.logger.log(`OTP sent successfully via ${vendor} for ${phoneNumber}`);
                return `OTP sent successfully via ${vendor}${isTest ? ' (Test Mode)' : ''}`;
            } else {
                otp.status = 'failed';
                await this.otpRepository.save(otp);
                this.logger.warn(`Failed to send OTP via ${vendor} for ${phoneNumber}`);
            }
        }

        this.logger.error(`Failed to send OTP for ${phoneNumber} using all vendors`);
        throw new Error(`Failed to send OTP via all vendors${isTest ? ' (Test Mode)' : ''}`);
    }

    async verifyOTP(phoneNumber: string, code: string, vendor: string): Promise<boolean> {
        if (vendor === 'VendorA' || vendor === 'VendorB') {
            let client: Twilio.Twilio;
            let verifyServiceSid: string;

            if (vendor === 'VendorA') {
                client = Twilio(
                    process.env.TWILIO_A_ACCOUNT_SID,
                    process.env.TWILIO_A_AUTH_TOKEN,
                );
                verifyServiceSid = process.env.TWILIO_A_VERIFY_SERVICE_SID;
            } else {
                client = Twilio(
                    process.env.TWILIO_B_ACCOUNT_SID,
                    process.env.TWILIO_B_AUTH_TOKEN,
                );
                verifyServiceSid = process.env.TWILIO_B_VERIFY_SERVICE_SID;
            }

            try {
                const verificationCheck = await client.verify.services(verifyServiceSid).verificationChecks.create({
                    to: phoneNumber,
                    code: code,
                });

                if (verificationCheck.status === 'approved') {
                    this.logger.log(`OTP verified successfully via ${vendor} for ${phoneNumber}`);
                    return true;
                } else {
                    this.logger.warn(`Failed to verify OTP via ${vendor} for ${phoneNumber}`);
                    return false;
                }
            } catch (error) {
                this.logger.error(`Error verifying OTP via ${vendor}: ${error.message}`);
                return false;
            }
        } else {
            this.logger.error(`Unknown vendor: ${vendor}`);
            throw new Error(`Unknown vendor: ${vendor}`);
        }
    }

    async verifyVendorOTP(phoneNumber: string, code: string): Promise<boolean> {
        if (code === '1234') {
            this.logger.log(`OTP verified successfully via Vendor for ${phoneNumber}`);
            return true;
        } else {
            this.logger.warn(`Failed to verify OTP via Vendor for ${phoneNumber}`);
            return false;
        }
    }
}