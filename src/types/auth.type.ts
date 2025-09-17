export const PermissionActionEnum = {
  Manage: 'manage',
  Read: 'read',
  Create: 'create',
  Update: 'update',
  Delete: 'delete',
} as const;
export type PermissionActionEnum =
  (typeof PermissionActionEnum)[keyof typeof PermissionActionEnum];

export const PermissionSubjectEnum = {
  All: 'all',
  Story: 'story',
  User: 'user',
  Role: 'role',
  Permission: 'permission',
} as const;
export type PermissionSubjectEnum =
  (typeof PermissionSubjectEnum)[keyof typeof PermissionSubjectEnum];

export const RoleEnum = {
  ADMIN: '1',
  USER: '2',
} as const;
export type RoleType = (typeof RoleEnum)[keyof typeof RoleEnum];

export interface ITokenPayload {
  email: string;
  roleId: RoleType;
  id: string;
  permissions: Array<{
    action: PermissionActionEnum;
    object: PermissionSubjectEnum;
  }>;
}

export interface IThirdPartyLoginUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  accessToken?: string;
  avatar?: string;
}

export interface IGoogleAuth {
  name: {
    givenName: string;
    familyName: string;
  };
  emails: [{ value: string }];
  picture: string;
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
