import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { LanguageCode } from '@/types/common.type';

export const Locale = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LanguageCode => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (request.query.locale) {
      return request.query.locale as LanguageCode;
    }

    const acceptLanguage = request.headers['accept-language'];

    if (acceptLanguage) {
      const preferredLanguage = acceptLanguage
        .split(',')
        .map((lang) => {
          const [code, weight] = lang.trim().split(';q=');

          return {
            code: code?.split('-')[0],
            q: weight ? Number.parseFloat(weight) : 1,
          };
        })
        .sort((a, b) => b.q - a.q)[0];

      return (
        (preferredLanguage?.code as LanguageCode | undefined) ?? LanguageCode.EN
      );
    }

    return LanguageCode.EN;
  },
);
