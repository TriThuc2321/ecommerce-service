import * as bcrypt from 'bcrypt';

export interface ISuccessMessage<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

export const SUCCESS_MESSAGE = <T>({
  statusCode = 200,
  message = 'Success',
  data,
}: ISuccessMessage<T>): ISuccessMessage<T> => ({
  statusCode,
  message,
  data,
});

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 12);

interface IComparePasswords {
  password: string;
  hashedPassword?: string | null;
}

export const comparePasswords = ({
  password,
  hashedPassword,
}: IComparePasswords): Promise<boolean> =>
  hashedPassword
    ? bcrypt.compare(password, hashedPassword)
    : Promise.resolve(false);

export const getSkip = ({
  page,
  take,
}: {
  page: number;
  take: number;
}): number => (page - 1) * take;

export const randomString = (length: number): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const sanitizedValue = (value: string): string =>
  value
    .replaceAll(/(<([^>]+)>)/gi, '')
    .replaceAll('"', '\\"')
    .replaceAll('\t', '')
    .replaceAll('\n', '');

export const getAliasCallCenter = (url: string) =>
  url.length > 0 ? url.split('call/')[1]! : '';
