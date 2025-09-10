import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PermissionActionEnum, PermissionSubjectEnum } from '@/types';

import { GetUser } from '../auth/decorators';
import { CheckPermissions } from '../auth/decorators/check-permissions.decorator';
import { CmsRolesService } from './cms-roles.service';
import {
  CreateRoleDto,
  DeleteRoleDto,
  QueryRoleDto,
  UpdateRoleDto,
} from './dto';

@Controller('cms-roles')
@ApiTags('Cms Roles')
export class CmsRolesController {
  constructor(private readonly cmsRolesService: CmsRolesService) {}

  @Get()
  @CheckPermissions([PermissionActionEnum.Read, PermissionSubjectEnum.Role])
  findAll(@Query() dto: QueryRoleDto) {
    return this.cmsRolesService.findAll(dto);
  }

  @Get(':id')
  @CheckPermissions([PermissionActionEnum.Read, PermissionSubjectEnum.Role])
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cmsRolesService.findOne(id);
  }

  @Post()
  @CheckPermissions([PermissionActionEnum.Create, PermissionSubjectEnum.Role])
  create(@Body() dto: CreateRoleDto) {
    return this.cmsRolesService.create(dto);
  }

  @Patch(':id')
  @CheckPermissions([PermissionActionEnum.Update, PermissionSubjectEnum.Role])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @GetUser('id') userId: string,
  ) {
    return this.cmsRolesService.update(id, dto, userId);
  }

  @Delete()
  @CheckPermissions([PermissionActionEnum.Delete, PermissionSubjectEnum.Role])
  delete(@Body() input: DeleteRoleDto, @GetUser('id') userId: string) {
    return this.cmsRolesService.delete(input, userId);
  }
}
