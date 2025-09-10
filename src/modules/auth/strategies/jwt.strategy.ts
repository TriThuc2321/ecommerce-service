import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ENV } from '@/configs/env.config';
import { IRequestWithCookies, ITokenPayload } from '@/types/auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: ENV.JWT.SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: IRequestWithCookies) =>
          request.cookies[ENV.COOKIE.ACCESS_TOKEN_NAME]!,
      ]),
    });
  }

  validate(payload: ITokenPayload) {
    return payload;
  }
}
