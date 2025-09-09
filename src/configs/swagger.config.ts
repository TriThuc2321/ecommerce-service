import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ENV } from './env.config';

export const configSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('AI Story APIs')
    .setDescription('AI Story APIs document')
    .setVersion('1.0.0')
    .addCookieAuth(ENV.COOKIE.ACCESS_TOKEN_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
