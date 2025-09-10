import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENV } from '@/configs';
import { Permission, PermissionRole, Role, User } from '@/entities';
import { PermissionGuard } from '@/modules/auth/guards/permission.guard';
import { CaslAbilityFactory } from '@/shared/casl/casl-ability.factory';
import { MailModule } from '@/shared/mail/mail.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission, PermissionRole, Role]),
    JwtModule.register({
      global: true,
      secret: ENV.JWT.SECRET,
      signOptions: { expiresIn: ENV.JWT.ACCESS_TOKEN_EXPIRATION_TIME },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    JwtStrategy,
    GoogleStrategy,
    AuthService,
    CaslAbilityFactory,
  ],
  exports: [AuthService],
})
export class AuthModule {}
