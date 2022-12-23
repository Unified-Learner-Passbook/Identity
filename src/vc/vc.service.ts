import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as ION from '@decentralized-identity/ion-tools';
import { HttpService } from '@nestjs/axios';
import { DidService } from 'src/did/did.service';
import { DIDDocument } from 'did-resolver';

@Injectable()
export default class VcService {
  constructor(
    private readonly primsa: PrismaService,
    private readonly httpService: HttpService,
    private readonly didService: DidService,
  ) { }

  async sign(signerDID: string, toSign: string) {
    const did = await this.primsa.identity.findUnique({
      where: { id: signerDID },
    });
    if (did) {
      const signedJWSEd25519 = await ION.signJws({
        payload: toSign,
        privateJwk: did.privateKey,
      });

      return {
        publicKey: (JSON.parse(did.didDoc as string) as DIDDocument)
          .verificationMethod[0].publicKeyJwk,
        signed: signedJWSEd25519,
      };
    } else {
      throw new NotFoundException('DID not found!');
    }
  }
}
