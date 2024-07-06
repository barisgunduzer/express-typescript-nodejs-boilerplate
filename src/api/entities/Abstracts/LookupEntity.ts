import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ModificationTimeEntity } from '@api/entities/Abstracts/ModificationTimeEntity';

export abstract class LookupEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column(() => ModificationTimeEntity, { prefix: false })
  timestamp: ModificationTimeEntity;
}
