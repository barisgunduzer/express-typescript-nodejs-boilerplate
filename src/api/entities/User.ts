import bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FullTimeEntity } from '@api/entities/Abstracts/FullTimeEntity';
import { Exclude } from 'class-transformer';
import { Role } from '@api/entities/Role';
import { EntityBase } from '@api/entities/Abstracts/EntityBase';

@Entity('users')
export class User extends EntityBase {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  @Exclude()
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column(() => FullTimeEntity, { prefix: false })
  timestamp: FullTimeEntity;

  @ManyToMany(() => Role, (roles) => roles.users)
  @JoinTable({
    name: 'users_roles',
    joinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
  })
  roles: Role[];

  @BeforeInsert()
  async beforeSetPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
