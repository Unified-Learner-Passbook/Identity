import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import KycService from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) { }
  @Post('/register')
  generateDID(@Body() body: any) {
    return this.kycService.registerUser(body);
  }

  @Post('/verify')
  async resolveDID(@Body() body: any) {
    return this.kycService.verifyUser(body);
  }
}
