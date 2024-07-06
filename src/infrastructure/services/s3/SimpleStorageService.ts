import { AwsProvider } from '@base/infrastructure/services/s3/providers/AwsProvider';

export class SimpleStorageService {
  private provider: any;

  public constructor() {
    this.setProvider('aws');
  }

  public setProvider(provider: string) {
    switch (provider) {
      case 'aws':
        this.provider = new AwsProvider();
        break;

      default:
        break;
    }

    return this;
  }

  public async uploadFile(file: any, bucket: string, key: string): Promise<string> {
    return await this.provider.uploadFile(file, bucket, key);
  }

  public async deleteFile(bucket: string, key: string): Promise<void> {
    return await this.provider.deleteFile(bucket, key);
  }

  public async getFile(bucket: string, key: string): Promise<any> {
    return await this.provider.getFile(bucket, key);
  }

  public getFileUrl(bucket: string, key: string): string {
    return this.provider.getFileUrl(bucket, key);
  }
}
