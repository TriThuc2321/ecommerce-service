import { Module } from '@nestjs/common';
import { dataSourceOptions } from './configs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './shared/mail/mail.module';
import { CmsRolesModule } from './modules/cms-roles/cms-roles.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { CmsUsersModule } from './modules/cms-users/cms-users.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10_000,
          limit: 10,
        },
        {
          name: 'long',
          ttl: 60_000,
          limit: 20,
        },
      ],
    }),
    AuthModule,
    MailModule,
    CmsRolesModule,
    RolesModule,
    CmsUsersModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
