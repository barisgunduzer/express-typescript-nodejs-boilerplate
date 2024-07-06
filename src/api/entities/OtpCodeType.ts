import { Entity } from 'typeorm';
import { LookupEntity } from '@api/entities/Abstracts/LookupEntity';

@Entity('otp_code_types')
export class OtpCodeType extends LookupEntity {}
