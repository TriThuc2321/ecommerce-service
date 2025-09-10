import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '@/entities';

import { CmsRolesService } from '../cms-roles/cms-roles.service';
import { QueryRoleDto } from '../cms-roles/dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly cmsRolesService: CmsRolesService,
  ) {}

  async findAll(dto: QueryRoleDto) {
    return this.cmsRolesService.findAll(dto);
  }

  async findOne(id: string) {
    return this.cmsRolesService.findOne(id);
  }
}
