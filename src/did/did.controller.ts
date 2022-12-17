import { IonDocumentModel } from '@decentralized-identity/ion-sdk';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { DidService } from './did.service';
import { generateDidDTO } from './dtos/GenerateDid.dto';
import { RolesGuard } from './roles.guard';

@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) {}

  @ApiOperation({ summary: 'Generate a new DID' })
  @ApiResponse({ type: ION status: 200, description: 'Generated DID' })
  @Post('/generate')
  generateDID(@Body() body: generateDidDTO) {
    return this.didService.generateDID(body);
  }

  @Get('/resolve/:id')
  async resolveDID(@Param('id') id: string) {
    return this.didService.resolveDID(id);
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)

  async updateDID(@Param('id') id: string, @Body() body: any) {
    return this.didService.updateDID(id, body);
  }
}
