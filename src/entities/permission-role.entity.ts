import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity('permissions_roles', { schema: 'public' })
export class PermissionRole {
  @PrimaryGeneratedColumn('increment', { name: 'permission_role_id' })
  id!: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: false })
  roleId!: string;

  @Column({ name: 'permission_id', type: 'uuid', nullable: false })
  permissionId!: string;

  @ManyToOne(() => Role)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role!: Role;

  @ManyToOne(() => Permission)
  @JoinColumn({
    name: 'permission_id',
    referencedColumnName: 'id',
  })
  permission!: Permission;
}
