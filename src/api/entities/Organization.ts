import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FullTimeEntity } from '@api/entities/Abstracts/FullTimeEntity';
import { Role } from './Role';
import { EntityBase } from '@api/entities/Abstracts/EntityBase';

@Entity('organizations')
export class Organization extends EntityBase {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ type: 'integer', nullable: true, default: null })
  parentId: number;

  @Index({ unique: true, where: 'deleted_at is null' })
  @Column({ type: 'varchar', length: 15 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column(() => FullTimeEntity, { prefix: false })
  timestamp: FullTimeEntity;

  @ManyToOne(() => Organization, (organizations) => organizations.organizations, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  parent: Organization;

  @OneToMany(() => Organization, (organizations) => organizations.parent)
  organizations: Organization[];

  @OneToMany(() => Role, (roles) => roles.organization)
  roles: Role[];
}
