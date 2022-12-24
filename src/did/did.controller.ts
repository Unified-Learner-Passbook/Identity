import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DIDDocument } from 'did-resolver';
import { DidService } from './did.service';
import { GenerateDidDTO } from './dtos/GenerateDid.dto';
import { JwtAuthGuard } from './roles.guard';

@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) { }

  @ApiOperation({ summary: 'Generate a new DID' })
  @ApiResponse({ status: 200, description: 'Generated DID' })
  @Post('/generate')
  async generateDID(
    @Body() generateRequest: GenerateDidDTO[], 
  ): Promise<DIDDocument[]> {
    let generatedDIDs: Array<DIDDocument> = []
    // TODO: Handle failed DIDs
    for (const generateDidDTO of generateRequest) {
      generatedDIDs.push(await this.didService.generateDID(generateDidDTO));
    }
    return generatedDIDs;
  }

  @Get('/resolve/:id')
  async resolveDID(@Param('id') id: string) {
    const did: DIDDocument = await this.didService.resolveDID(id);
    if (did) {
      return did;
    } else {
      throw new NotFoundException('DID could not be resolved!');
    }
  }

  // @Patch('/update/:id')
  // @UseGuards(JwtAuthGuard)
  // async updateDID(@Param('id') id: string, @Body() body: any) {
  //   return this.didService.updateDID(id, body);
  // }
}
