export const PermissionAction = {
  Manage: 'manage',
  Read: 'read',
  Create: 'create',
  Update: 'update',
  Delete: 'delete',
} as const;
export type PermissionAction =
  (typeof PermissionAction)[keyof typeof PermissionAction];

export const PermissionSubject = {
  All: 'all',
  Story: 'story',
  User: 'user',
  Role: 'role',
  Permission: 'permission',
} as const;
export type PermissionSubject =
  (typeof PermissionSubject)[keyof typeof PermissionSubject];

export const Role = {
  ADMIN: '1',
  USER: '2',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export interface ITokenPayload {
  email: string;
  roleId: Role;
  id: string;
  permissions: Array<{
    action: PermissionAction;
    object: PermissionSubject;
  }>;
}

export interface IThirdPartyLoginUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  accessToken: string;
}

export interface IGoogleAuth {
  name: {
    givenName: string;
    familyName: string;
  };
  emails: [{ value: string }];
}

export interface IRequestWithUser extends Request {
  user: ITokenPayload;
}

export interface IRequestWithCookies extends Request {
  cookies: Record<string, string>;
}

export interface IJwtPayload {
  id: string;
  email: string;
  roleId: string;
}

export const UserCodeTypeEnum = {
  EMAIL_VERIFY: 'email_verify',
  FORGOT_PASSWORD: 'forgot_password',
} as const;
export type UserCodeTypeEnum =
  (typeof UserCodeTypeEnum)[keyof typeof UserCodeTypeEnum];

export const UserErrorEnum = {
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
} as const;
export type UserErrorEnum = (typeof UserErrorEnum)[keyof typeof UserErrorEnum];
