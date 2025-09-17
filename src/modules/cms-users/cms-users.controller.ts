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
import { CmsUsersService } from './cms-users.service';
import {
  CreateUserDto,
  DeleteUserDto,
  QueryUserDto,
  UpdateUserDto,
} from './dto';

@Controller('cms-users')
@ApiTags('Cms Users')
export class CmsUsersController {
  constructor(private readonly cmsUsersService: CmsUsersService) {}

  @Get()
  @CheckPermissions([PermissionActionEnum.Read, PermissionSubjectEnum.User])
  findAll(@Query() dto: QueryUserDto) {
    return this.cmsUsersService.findAll(dto);
  }

  @Get(':id')
  @CheckPermissions([PermissionActionEnum.Read, PermissionSubjectEnum.User])
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cmsUsersService.findOne(id);
  }

  @Post()
  @CheckPermissions([PermissionActionEnum.Create, PermissionSubjectEnum.User])
  create(@Body() dto: CreateUserDto) {
    return this.cmsUsersService.create(dto);
  }

  @Patch(':id')
  @CheckPermissions([PermissionActionEnum.Update, PermissionSubjectEnum.User])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @GetUser('id') userId: string,
  ) {
    return this.cmsUsersService.update(id, dto, userId);
  }

  @Delete()
  @CheckPermissions([PermissionActionEnum.Delete, PermissionSubjectEnum.User])
  delete(@Body() input: DeleteUserDto, @GetUser('id') userId: string) {
    return this.cmsUsersService.delete(input, userId);
  }
}
