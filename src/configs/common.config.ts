import { readFileSync } from 'node:fs';

import { ENV } from './env.config';

export const httpsOptions = {
  key: ENV.HTTPS_OPTIONS.KEY_PATH && readFileSync(ENV.HTTPS_OPTIONS.KEY_PATH),
  cert:
    ENV.HTTPS_OPTIONS.CERT_PATH && readFileSync(ENV.HTTPS_OPTIONS.CERT_PATH),
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 1000 * ENV.JWT.ACCESS_TOKEN_EXPIRATION_TIME),
  domain: ENV.COOKIE.DOMAIN,
};
