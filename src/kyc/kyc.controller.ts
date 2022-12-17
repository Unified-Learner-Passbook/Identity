import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import KycService from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) { }
  @Post('/triggerKyc')
  triggerKyc(@Body() body: any) {
    return this.kycService.triggerKyc(body);
  }

  @Post('/register')
  register(@Body() body: any) {
    return this.kycService.register(body);
  }
}
