import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreationTimeEntity } from '@api/entities/Abstracts/CreationTimeEntity';
import { OtpCodeType } from '@api/entities/OtpCodeType';
import { EntityBase } from '@api/entities/Abstracts/EntityBase';

@Entity('otp_codes')
@Index(['userId', 'otpCodeTypeId'])
export class OtpCode extends EntityBase {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @Column({ type: 'int' })
  otpCodeTypeId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  destination: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  token: string;

  @Column({ type: 'date', nullable: true })
  expireTime: Date;

  @Column(() => CreationTimeEntity, { prefix: false })
  timestamp: CreationTimeEntity;

  @ManyToOne(() => OtpCodeType)
  @JoinColumn({ name: 'otp_code_type_id' })
  otpCodeType: OtpCodeType;
}
