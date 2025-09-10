import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CheckPermissions } from '../auth/decorators/check-permissions.decorator';
import { QueryRoleDto } from '../cms-roles/dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export default class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @CheckPermissions()
  findAll(@Query() dto: QueryRoleDto) {
    return this.rolesService.findAll(dto);
  }

  @Get(':id')
  @CheckPermissions()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }
}
