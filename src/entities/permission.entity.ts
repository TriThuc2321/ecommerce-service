import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuditMetadata } from './audit-metadata.entity';

@Entity('permissions', { schema: 'public' })
export class Permission {
  @PrimaryGeneratedColumn('increment', { name: 'permission_id' })
  id!: string;

  @Column({ name: 'action', type: 'varchar', length: 255 })
  action!: string;

  @Column({ name: 'subject', type: 'varchar', length: 255 })
  subject!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column(() => AuditMetadata, { prefix: false })
  auditMetadata!: AuditMetadata;
}
