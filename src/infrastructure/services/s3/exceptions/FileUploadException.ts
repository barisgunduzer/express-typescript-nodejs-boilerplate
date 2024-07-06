import { InternalServerError } from 'routing-controllers';

export class FileUploadException extends InternalServerError {
  constructor() {
    super('Failed to upload file');
  }
}
