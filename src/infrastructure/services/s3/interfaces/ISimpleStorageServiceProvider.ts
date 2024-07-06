export interface ISimpleStorageServiceProvider {
  uploadFile(file: any, bucket: string, key: string): Promise<string>;
  deleteFile(bucket: string, key: string): Promise<void>;
  getFile(bucket: string, key: string): Promise<any>;
  getFileUrl(bucket: string, key: string): string;
}
