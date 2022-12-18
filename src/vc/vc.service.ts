import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as ION from '@decentralized-identity/ion-tools';
import { HttpService } from '@nestjs/axios';
import { verifyJsonDTO } from './dtos/Verify.dto';
import { DidService } from 'src/did/did.service';

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
      const signedJWSsecp256k1 = await ION.signJws({
        payload: toSign,
        privateJwk: did.privateKey,
      });

      const didDocument = await this.didService.resolveDID(signerDID);
      return {
        publicKey: didDocument.didDocument.publicKey,
        signature: signedJWSsecp256k1,
      };
    } else {
    }
  }

  async verify(signerDID: string, signedDoc: string): Promise<boolean> {
    const didDocument = await this.didService.resolveDID(signerDID);
    try {
      const verified = await ION.verifyJws({
        jws: signedDoc,
        publicJwk: didDocument.didDocument.publicKey[0].publicKeyJwk,
      }); // throws when it fails
      return true;
    } catch (e) {
      return false;
    }
  }
}
