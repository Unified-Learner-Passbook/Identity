import { ApiProperty } from '@nestjs/swagger';
import { DIDDocument, Service } from 'did-resolver';

export class GenerateDidDTO {
  @ApiProperty()
  alsoKnownAs?: string[];
  service?: Service[];
}
