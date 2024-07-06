import bcrypt from 'bcrypt';
import { hashingConfig } from '@base/config/hashing';
import { IHashProvider } from '@base/infrastructure/services/hash/interfaces/IHashProvider';

export class BcryptProvider implements IHashProvider {
  private bcrypt = bcrypt;

  private defaultRounds = hashingConfig.disks.bcrypt.defaultRounds;

  public async make(data: any, saltOrRounds: string | number = this.defaultRounds) {
    return await this.bcrypt.hash(data, saltOrRounds);
  }

  public async compare(data: any, encrypted: string) {
    return await this.bcrypt.compare(data, encrypted);
  }
}
