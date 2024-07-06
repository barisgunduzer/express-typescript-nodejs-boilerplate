import { CreateDateColumn } from 'typeorm';
import { ICreationTimeEntity } from '@api/entities/Abstracts/Interfaces/ICreationTimeEntity';

export abstract class CreationTimeEntity implements ICreationTimeEntity {
  @CreateDateColumn()
  createdAt: Date;
}
