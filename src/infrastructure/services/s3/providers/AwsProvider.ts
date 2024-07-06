import { ISimpleStorageServiceProvider } from '@base/infrastructure/services/s3/interfaces/ISimpleStorageServiceProvider';

export class AwsProvider implements ISimpleStorageServiceProvider {
  public async uploadFile(file: any, bucket: string, key: string): Promise<string> {
    // Implementation
    return '';
  }

  public async deleteFile(bucket: string, key: string): Promise<void> {
    // Implementation
  }

  public async getFile(bucket: string, key: string): Promise<any> {
    // Implementation
    return {};
  }

  public getFileUrl(bucket: string, key: string): string {
    // Implementation
    return '';
  }
}
