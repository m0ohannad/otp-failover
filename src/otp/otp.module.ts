import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './otp.entity';
import { OTPService } from './otp.service';
import { OTPController } from './otp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  providers: [OTPService],
  controllers: [OTPController],
})
export class OTPModule {}
