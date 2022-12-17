import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import KycService from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) { }
  @Post('/register')
  registerUser(@Body() body: any) {
    return this.kycService.registerUser(body);
  }

  @Post('/verifyRegistrationOtp')
  verifyRegistrationOtp(@Body() body: any) {
    return this.kycService.verifyRegistrationOtp(body);
  }

  @Post('/login')
  async loginUser(@Body() body: any) {
    return this.kycService.loginUser(body);
  }

  @Post('/verifyLoginOtp')
  async verifyLoginOtp(@Body() body: any) {
    return this.kycService.verifyLoginOtp(body);
  }
}
