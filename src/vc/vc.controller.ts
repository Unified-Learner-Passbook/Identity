import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { signJsonDTO } from './dtos/Sign.dto';
import { verifyJsonDTO } from './dtos/Verify.dto';
import VcService from './vc.service';

@Controller('utils')
export class VcController {
  constructor(private readonly VcService: VcService) { }
  @Post('/sign')
  sign(@Body() body: signJsonDTO) {
    return this.VcService.sign(body.DID, body.payload);
  }

  @Post('/verify')
  verify(@Body() body: verifyJsonDTO) {
    return this.VcService.sign(body.DID, body.payload);
  }
}
