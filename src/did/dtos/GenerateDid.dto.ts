import { ApiProperty } from '@nestjs/swagger';
import { DIDDocument, Service } from 'did-resolver';

export class generateDidDTO {
  @ApiProperty()
  alsoKnownAs?: string[];
  service?: Service[];
}
