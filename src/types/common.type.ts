export interface ISuccessMessage<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

export const LanguageCode = {
  EN: 'en',
  VI: 'vi',
} as const;
export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode];

export interface ICatchError {
  message?: string;
}
