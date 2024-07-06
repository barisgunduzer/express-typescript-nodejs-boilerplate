import { DeleteDateColumn } from 'typeorm';
import { ModificationTimeEntity } from '@api/entities/Abstracts/ModificationTimeEntity';
import { IFullTimeEntity } from '@api/entities/Abstracts/Interfaces/IFullTimeEntity';

export abstract class FullTimeEntity extends ModificationTimeEntity implements IFullTimeEntity {
  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt?: Date;

  isSoftDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
