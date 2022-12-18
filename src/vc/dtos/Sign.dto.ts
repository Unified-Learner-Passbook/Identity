import { IonDocumentModel } from '@decentralized-identity/ion-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class signJsonDTO {
  @ApiProperty()
  DID: string;
  payload: string; //Only string is supported for now
}
