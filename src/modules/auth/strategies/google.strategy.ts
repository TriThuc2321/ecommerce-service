import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { IGoogleAuth, IThirdPartyLoginUser } from '@/types/auth.type';
import { ENV } from '@/configs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: ENV.GOOGLE.CLIENT_ID || '',
      clientSecret: ENV.GOOGLE.CLIENT_SECRET || '',
      callbackURL: ENV.GOOGLE.CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: IGoogleAuth,
    cb: VerifyCallback,
  ) {
    const { name, emails, picture } = profile;
    const { givenName, familyName } = name;

    const user: IThirdPartyLoginUser = {
      email: emails[0].value,
      firstName: givenName,
      lastName: familyName,
      avatar: picture,
      accessToken,
    };

    cb(null, user);
  }
}
