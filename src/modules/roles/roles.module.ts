import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionRole, Role, User } from '@/entities';
import { CaslModule } from '@/shared/casl/casl.module';

import { CmsRolesModule } from '../cms-roles/cms-roles.module';
import RolesController from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, PermissionRole]),
    CaslModule,
    CmsRolesModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
