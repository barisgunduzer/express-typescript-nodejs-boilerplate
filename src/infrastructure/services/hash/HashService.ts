import { hashingConfig } from '@base/config/hashing';
import { Service } from 'typedi';
import { BcryptProvider } from '@base/infrastructure/services/hash/providers/BcryptProvider';
import { IHashService } from '@base/infrastructure/services/hash/interfaces/IHashService';

@Service()
export class HashService implements IHashService {
  private provider: any;

  public constructor() {
    this.setDriver(hashingConfig.defaultDriver);
  }

  public setDriver(provider: string) {
    switch (provider) {
      case 'bcrypt':
        this.provider = new BcryptProvider();
        break;

      default:
        break;
    }

    return this;
  }

  public async make(data: any, saltOrRounds: string | number = 10): Promise<string> {
    return await this.provider.make(data, saltOrRounds);
  }

  public async compare(data: any, encrypted: string): Promise<boolean> {
    return await this.provider.compare(data, encrypted);
  }
}
