import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import VcService from './vc.service';

@Controller('vc')
export class VcController {
  constructor(private readonly VcService: VcService) { }
  @Post('/sign')
  registerUser(@Body() body: any) {
    return this.VcService.sign(body);
  }
}
