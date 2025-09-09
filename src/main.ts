import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { AppModule } from './app.module';
import { configSwagger, configureCors, ENV, httpsOptions } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: ENV.HTTPS_OPTIONS.ENABLE ? httpsOptions : undefined,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors(configureCors());

  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      secret: ENV.SESSION_SECRET ?? '',
      resave: false,
      saveUninitialized: true,
    }),
  );

  configSwagger(app);

  process.env.TZ = 'UTC';

  await app.listen(ENV.APP_PORT, '0.0.0.0', () => {
    let LOCAL_DOMAIN = 'http://localhost';

    if (ENV.HTTPS_OPTIONS.ENABLE) {
      LOCAL_DOMAIN = `https://${ENV.HTTPS_OPTIONS.DOMAIN}`;
    }

    Logger.log(`API run on ${LOCAL_DOMAIN}:${ENV.APP_PORT}/api`);
  });
}

bootstrap();
