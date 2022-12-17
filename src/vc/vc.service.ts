import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as ION from '@decentralized-identity/ion-tools';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';


@Injectable()
export default class VcService {
  constructor(private readonly primsa: PrismaService, private readonly httpService: HttpService) { }

  async sign(body: any) {
    const id = body.id;
    const vcUnsigned = body.vc;

    const artifact = await this.primsa.identity.findUnique({
      where: { id }
    })
    if (artifact) {
      const signature = await ION.signJws({
        "payload": vcUnsigned,
        "privateJwk": artifact.privateKey,
      })
      const resolvedResponse = await lastValueFrom(this.httpService.get(`http://localhost:3001/did/resolve/${id}`))
      const publicKey = resolvedResponse.data.didDocument.verificationMethod[0].publicKeyJwk
      return {
        "credential": vcUnsigned,
        "publicKey": publicKey,
        "signature": signature
      }
    }
    else {

    }
  }
}
