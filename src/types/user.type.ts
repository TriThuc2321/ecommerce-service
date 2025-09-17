export enum Provider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export interface IGetUserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  avatar: string;
  role: { id: string; name: string };
  permissions: Array<{ action: string; subject: string }>;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roleId: string;
  emailVerified: boolean;
}
