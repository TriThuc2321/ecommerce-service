export interface ISuccessMessage<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

export const LanguageCodeEnum = {
  EN: 'en',
  VI: 'vi',
} as const;

export type LanguageCodeEnum =
  (typeof LanguageCodeEnum)[keyof typeof LanguageCodeEnum];

export interface ICatchError {
  message?: string;
}
