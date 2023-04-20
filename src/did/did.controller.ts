import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DIDDocument } from 'did-resolver';
import { DidService } from './did.service';
import { GenerateDidDTO } from './dtos/GenerateDid.dto';

@ApiTags('DID')
@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) {}

  @ApiOperation({ summary: 'Generate a new DID' })
  @ApiOkResponse({ description: 'DID Generated', isArray: true })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({ type: GenerateDidDTO, isArray: true })
  @Post('/generate')
  async generateDID(
    @Body() generateRequest: { content: GenerateDidDTO[] },
  ): Promise<DIDDocument[]> {
    const generatedDIDs: Array<DIDDocument> = [];
    // TODO: Handle failed DIDs
    for (const generateDidDTO of generateRequest.content) {
      generatedDIDs.push(await this.didService.generateDID(generateDidDTO));
    }
    return generatedDIDs;
  }

  @ApiOperation({ summary: 'Resolve a DID ID' })
  @ApiOkResponse({ description: 'DID resolved' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'DID not found' })
  @ApiParam({ name: 'id', description: 'The DID ID to resolve' })
  @Get('/resolve/:id')
  async resolveDID(@Param('id') id: string): Promise<DIDDocument> {
    const did: DIDDocument = await this.didService.resolveDID(id);
    if (did) {
      return did;
    } else {
      throw new NotFoundException('DID could not be resolved!');
    }
  }
}
