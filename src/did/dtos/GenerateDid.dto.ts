import { IonDocumentModel } from '@decentralized-identity/ion-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class generateDidDTO {
  @ApiProperty()
  content: IonDocumentModel;
}
