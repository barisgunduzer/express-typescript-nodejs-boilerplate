import { fileSystemsConfig } from '@base/config/file';
import { Service } from 'typedi';
import { LocalDisk } from '@base/infrastructure/services/storage/providers/LocalDisk';
import { IStorageService } from '@base/infrastructure/services/storage/interfaces/IStorageService';

@Service()
export class StorageService implements IStorageService {
  private disk: any;

  public constructor() {
    this.setProvider(fileSystemsConfig.defaultDisk);
  }

  public setProvider(providerName: string) {
    switch (providerName) {
      case 'local':
        this.disk = new LocalDisk();
        break;

      default:
        break;
    }

    return this;
  }

  public async putFile(filePath: string, content: string | Buffer, encoding?: string): Promise<void> {
    return await this.disk.put(filePath, content, encoding);
  }

  public async deleteFile(filePath: string): Promise<void> {
    return await this.disk.delete(filePath);
  }

  public createDirectory(dir: string): boolean {
    return this.disk.createDirectory(dir);
  }
}
