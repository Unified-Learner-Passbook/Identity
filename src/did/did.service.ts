import { Injectable, NotFoundException } from '@nestjs/common';
import * as ION from '@decentralized-identity/ion-tools';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DidService {
  constructor(private prisma: PrismaService) {}

  async generateDID(body: any) {
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
          didDoc: anchorResponse as Prisma.JsonValue,
          privateKey: authnKeys.privateJwk,
        },
      });

      return anchorResponse;
    } else {
      throw new Error('err');
    }
  }

  async resolveDID(id: string) {
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
          return artifact.didDoc;
        }
      } else {
        throw new Error('Not Found');
      }
    } catch (err) {
      throw new NotFoundException(`${id} not found`);
    }
  }
}
