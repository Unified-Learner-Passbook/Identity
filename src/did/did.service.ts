import { Injectable, NotFoundException } from '@nestjs/common';
import * as ION from '@decentralized-identity/ion-tools';
import { PrismaService } from 'src/prisma.service';
import { Identity } from '@prisma/client';
import { IDidDocument } from '@decentralized-identity/did-common-typescript';

export type DIDDocument = {
  [key: string]: any;
  '@context': 'https://w3id.org/did-resolution/v1';
  didDocument: IDidDocument;
  didDocumentMetadata: any;
};

@Injectable()
export class DidService {
  constructor(private prisma: PrismaService) {}

  async generateDID(body: any): Promise<DIDDocument> {
    // for checking later: did:ion:EiDD8WbnNy6mY32G5x4Q6PDijZTE3i16zoDtAqEQboU6CQ
    // did:ion:EiCx-pbUGHbqs3a2gYj6n03fI1KQp2bnYWP8kosaLlBs4g
    // did:ion:EiCVe1bcyU9EA85QTsjvZv-51xdIA6DjR9ZCktu--DqnOA

    // Create private/public key pair
    const authnKeys = await ION.generateKeyPair('secp256k1');

    // Create a DID
    const content = body.content;
    content['publicKeys'] = [
      {
        id: 'auth-key',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyJwk: authnKeys.publicJwk,
        purposes: ['authentication'],
      },
    ];

    const did = new ION.DID({
      content: content,
    });

    const anchorRequestBody = await did.generateRequest();
    const didUri: string = await did.getURI('short');
    const anchorRequest = new ION.AnchorRequest(anchorRequestBody);
    const anchorResponse = await anchorRequest.submit();
    if (anchorResponse) {
      await this.prisma.identity.create({
        data: {
          id: didUri,
          didDoc: anchorResponse as DIDDocument,
          privateKey: authnKeys.privateJwk,
        },
      });

      return anchorResponse;
    } else {
      throw new Error('err');
    }
  }

  async resolveDID(id: string): Promise<DIDDocument> {
    // check on the blockchain and update status
    // URI: https://identity.foundation/ion/explorer/?did={DID}
    try {
      // check in db
      const artifact = await this.prisma.identity.findUnique({
        where: { id },
      });

      if (artifact) {
        if (!artifact.blockchainStatus) {
          try {
            const response = await ION.resolve(id);
            console.log(JSON.stringify(response));
            this.prisma.identity.update({
              where: {
                id,
              },
              data: {
                blockchainStatus: true,
              },
            });
          } catch (err) {
            console.log('not updated on blockchain');
          }
          return artifact.didDoc as DIDDocument;
        }
      } else {
        throw new Error('Not Found');
      }
    } catch (err) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async updateDID(id: string, data: any) {
    let artifact: Identity | null = null;
    try {
      artifact = await this.prisma.identity.findUnique({
        where: {
          id,
        },
      });
      console.log(
        'artifact: ',
        JSON.parse(artifact.didDoc as string)?.didDocument
          ?.verificationMethod[0].publicKeyJwk,
      );

      const content = data.content;
      content['publicKeys'] = [
        {
          id: 'auth-key',
          type: 'EcdsaSecp256k1VerificationKey2019',
          publicKeyJwk: JSON.parse(artifact.didDoc as string)?.didDocument
            ?.verificationMethod[0].publicKeyJwk,
          purposes: ['authentication'],
        },
      ];

      const did = new ION.DID({
        content: content,
      });

      console.log('did: ', did);

      const updateOperation = await did.generateOperation('update', {
        addServices: content.services,
      });

      console.log('updateOperation: ', updateOperation);
      const updateRequestBody = await did.generateRequest(1, updateOperation);
      const updateRequest = new ION.AnchorRequest(updateRequestBody);
      console.log('updateRequestBody: ', updateRequestBody);

      const updateResponse = await updateRequest.submit();

      console.log('updateResponse: ', updateResponse);

      // if (updateResponse) {
      return 'Successfully Updated';
    } catch (err) {
      throw new Error(err);
    }
    // }
    // throw new Error('Not Registered');
  }
}
