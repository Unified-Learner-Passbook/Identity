import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Vault = require('hashi-vault-js');

@Injectable()
export class VaultService {
  private token = process.env.VAULT_TOKEN;
  private vault = new Vault({
    https: false,
    baseUrl: `${process.env.VAULT_ADDR}/v1`,
    rootPath: `${process.env.VAULT_ADDR}/v1/kv`,
    timeout: 5000,
    proxy: false,
  });

  async checkStatus() {
    const status = await this.vault.healthCheck();
    await this.vault.readKVEngineConfig(this.token);
    return status;
  }
  async writePvtKey(secret: string, name: string, path?: string) {
    const createSecret = await this.vault.createKVSecret(
      this.token,
      path ? path + `/${name}` : `ulp/identity-ms/private_keys/${name}`,
      secret,
    );
    return createSecret;
  }

  async readPvtKey(name: string, path?: string) {
    const read = await this.vault.readKVSecret(
      this.token,
      path ? path + `/${name}` : `ulp/identity-ms/private_keys/${name}`,
    );
    return read.data;
  }
}
