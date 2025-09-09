import { ENV } from './env.config';

export const configureCors = () => {
  const origins = ENV.CORS_CONFIGURE?.split(',');

  return {
    origin: origins ?? ['http://localhost:3000'],
    credentials: true,
  };
};
