import { IonDocumentModel } from '@decentralized-identity/ion-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyJsonDTO {
  @ApiProperty()
  DID: string;
  payload: string; //Only string is supported for now
}
