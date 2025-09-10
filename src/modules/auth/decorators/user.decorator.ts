import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

import type { IRequestWithUser, ITokenPayload } from '@/types';

export const GetUser = createParamDecorator(
  (
    key: keyof ITokenPayload | undefined,
    ctx: ExecutionContext,
  ): ITokenPayload | ITokenPayload[keyof ITokenPayload] => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUser>();

    const user = request.user;

    return key ? user[key] : user;
  },
);
