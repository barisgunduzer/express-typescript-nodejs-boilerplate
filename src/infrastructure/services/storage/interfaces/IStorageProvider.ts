export interface IStorageProvider {
  putFile(filePath: string, content: string | Buffer, encoding?: string): Promise<void>;
  deleteFile(filePath: string): void;
}
