import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, MinLength } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Provider } from '@/types';

import { AuditMetadata } from './audit-metadata.entity';
import { Role } from './role.entity';

@Entity('users', { schema: 'public' })
@Index('idx_users_email', ['email'])
@Index('idx_users_first_name', ['firstName'])
@Index('idx_users_last_name', ['lastName'])
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id!: string;

  @Unique('uq_users_email', ['email'])
  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  @IsEmail()
  email?: string | null;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
  @MinLength(6)
  @Exclude()
  password?: string | null;

  @Column({
    name: 'provider',
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  @IsEnum(Provider)
  provider!: Provider;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
  firstName?: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
  lastName?: string | null;

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  avatar?: string | null;

  originalAvatar?: string | null;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId!: string;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column(() => AuditMetadata, { prefix: false })
  auditMetadata!: AuditMetadata;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role!: Role;
}
