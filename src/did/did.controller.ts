import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DidService } from './did.service';

@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) {}
  @Post('/generate')
  generateDID(@Body() body: any) {
    return this.didService.generateDID(body);
  }

  @Get('/resolve/:id')
  async resolveDID(@Param('id') id: string) {
    return this.didService.resolveDID(id);
  }
}
