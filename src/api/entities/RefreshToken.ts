import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreationTimeEntity } from '@api/entities/Abstracts/CreationTimeEntity';
import { EntityBase } from '@api/entities/Abstracts/EntityBase';

@Entity('refresh_tokens')
@Index(['userId', 'roleId'])
export class RefreshToken extends EntityBase {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @Column({ type: 'smallint' })
  roleId: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  token: string;

  @Column({ type: 'date', nullable: true })
  expireTime: Date;

  @Column(() => CreationTimeEntity, { prefix: false })
  timestamp: CreationTimeEntity;
}
