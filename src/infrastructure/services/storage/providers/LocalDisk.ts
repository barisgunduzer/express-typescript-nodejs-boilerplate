import path from 'path';
import * as fs from 'fs';
import { fileSystemsConfig } from '@base/config/file';
import { IStorageProvider } from '@base/infrastructure/services/storage/interfaces/IStorageProvider';

export class LocalDisk implements IStorageProvider {
  private root = fileSystemsConfig.disks.local.root;

  public async putFile(filePath: string, content: string | Buffer, encoding?: string): Promise<void> {
    filePath = `${this.root}/${filePath}`;

    return new Promise<void>((resolve, reject) => {
      if (!filePath || !filePath.trim()) return reject(new Error('The path is required!'));
      if (!content) return reject(new Error('The content is required!'));

      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) this.createDirectory(dir);

      if (dir === filePath.trim()) return reject(new Error('The path is invalid!'));

      fs.writeFile(filePath, content, encoding as fs.EncodingOption, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  public deleteFile(filePath: string): void {
    filePath = `${this.root}/${filePath}`;

    if (!filePath || !filePath.trim()) throw new Error('The path is required!');

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  private createDirectory(dir: string): void {
    const splitPath = dir.split('/');
    if (splitPath.length > 20) throw new Error('The path is invalid!');

    splitPath.reduce((path, subPath) => {
      let currentPath;
      if (subPath !== '.') {
        currentPath = `${path}/${subPath}`;
        if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
      } else currentPath = subPath;

      return currentPath;
    }, '');
  }
}
