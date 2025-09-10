import { config } from 'dotenv';

config();

export const ENV = {
  CORS_CONFIGURE: process.env.CORS_CONFIGURE,
  APP_PORT: process.env.APP_PORT ?? 8080,
  DOMAIN: {
    SERVER: process.env.SERVER_DOMAIN,
    WEBSITE: process.env.WEBSITE_DOMAIN ?? '',
  },
  DATABASE: {
    HOST: process.env.DATABASE_HOST,
    PORT: Number(process.env.DATABASE_PORT),
    UID: process.env.DATABASE_UID,
    PWD: process.env.DATABASE_PWD,
    NAME: process.env.DATABASE_NAME,
    SYNC: process.env.DATABASE_SYNC === 'true',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET ?? '',
    ACCESS_TOKEN_EXPIRATION_TIME: Number(process.env.ACCESS_TOKEN_EXPIRE),
    SECRET_REFRESH: process.env.JWT_SECRET_REFRESH ?? '',
    REFRESH_TOKEN_EXPIRATION_TIME: Number(process.env.REFRESH_TOKEN_EXPIRE),
  },
  SESSION_SECRET: process.env.SESSION_SECRET,
  HTTPS_OPTIONS: {
    ENABLE: process.env.HTTPS_ENABLE === 'true',
    KEY_PATH: process.env.HTTPS_KEY_PATH,
    CERT_PATH: process.env.HTTPS_CERT_PATH,
    DOMAIN: process.env.HTTPS_LOCAL_DOMAIN ?? 'https://localhost',
  },
  COOKIE: {
    DOMAIN: process.env.COOKIE_DOMAIN,
    ACCESS_TOKEN_NAME:
      process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'ai-story-access-token',
    REFRESH_TOKEN_NAME:
      process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'ai-story-refresh-token',
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  },
};
