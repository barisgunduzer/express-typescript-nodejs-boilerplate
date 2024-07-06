import { UpdateDateColumn } from 'typeorm';
import { CreationTimeEntity } from '@api/entities/Abstracts/CreationTimeEntity';
import { IModificationTimeEntity } from '@api/entities/Abstracts/Interfaces/IModificationTimeEntity';

export abstract class ModificationTimeEntity extends CreationTimeEntity implements IModificationTimeEntity {
  @UpdateDateColumn()
  updatedAt: Date;
}
