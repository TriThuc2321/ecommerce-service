import type { PermissionAction, PermissionSubject } from './auth.type';

export interface IRole {
  id: string;
  name: string;
  code: string;
  canAccessCms: boolean;
  isActive: boolean;
  permissions: Array<{
    action: PermissionAction;
    subject: PermissionSubject;
  }>;
}
