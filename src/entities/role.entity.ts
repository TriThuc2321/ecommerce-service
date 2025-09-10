import { IsBoolean } from 'class-validator';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { AuditMetadata } from './audit-metadata.entity';
import { PermissionRole } from './permission-role.entity';
import { User } from './user.entity';

@Entity('roles', { schema: 'public' })
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'role_id' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Unique('uq_roles_code', ['code'])
  @Column({ type: 'varchar', length: 255 })
  code!: string;

  @Column(() => AuditMetadata, { prefix: false })
  auditMetadata!: AuditMetadata;

  @Column({ name: 'can_access_cms', type: 'boolean', default: false })
  @IsBoolean()
  canAccessCms!: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @IsBoolean()
  isActive!: boolean;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];

  @OneToMany(() => PermissionRole, (permissionRole) => permissionRole.role)
  permissionRoles!: PermissionRole[];
}
