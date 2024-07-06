import { FullTimeEntity } from '@api/entities/Abstracts/FullTimeEntity';
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Organization } from './Organization';
import { EntityBase } from '@api/entities/Abstracts/EntityBase';

@Entity('roles')
@Index(['organizationId', 'name'], { unique: true, where: 'deleted_at is null' })
export class Role extends EntityBase {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column({ type: 'integer', nullable: true })
  organizationId: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', unique: true, length: 50 })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('varchar', { nullable: true, length: 100 })
  displayName: string;

  @Column(() => FullTimeEntity, { prefix: false })
  timestamp: FullTimeEntity;

  @ManyToOne(() => Organization, (organizations) => organizations.roles)
  @JoinColumn([{ name: 'organization_id', referencedColumnName: 'id' }])
  organization: Organization;

  @ManyToMany(() => User, (users) => users.roles)
  users: User[];
}
