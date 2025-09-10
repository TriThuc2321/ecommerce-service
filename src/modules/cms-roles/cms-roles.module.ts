import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission, PermissionRole, Role } from '@/entities';

import { CmsRolesController } from './cms-roles.controller';
import { CmsRolesService } from './cms-roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, PermissionRole, Permission])],
  controllers: [CmsRolesController],
  providers: [CmsRolesService],
  exports: [CmsRolesService],
})
export class CmsRolesModule {}
