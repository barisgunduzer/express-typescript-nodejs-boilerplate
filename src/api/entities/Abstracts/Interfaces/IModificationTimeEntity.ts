import { ICreationTimeEntity } from './ICreationTimeEntity';

export interface IModificationTimeEntity extends ICreationTimeEntity {
  updatedAt: Date;
}
