import { IModificationTimeEntity } from './IModificationTimeEntity';

export interface IFullTimeEntity extends IModificationTimeEntity {
  deletedAt?: Date;
}
