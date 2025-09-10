import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { In, IsNull, Repository } from 'typeorm';

import { PermissionRole, Role } from '@/entities';
import { PageMetaDto, PaginationDto } from '@/shared/dto';
import { IRole } from '@/types';
import { getSkip } from '@/utils/common.util';

import {
  CreateRoleDto,
  DeleteRoleDto,
  QueryRoleDto,
  UpdateRoleDto,
} from './dto';

@Injectable()
export class CmsRolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  private getBaseRoleQuery() {
    return this.roleRepository
      .createQueryBuilder('r')
      .select([
        'r.role_id as id',
        'r.name as name',
        'r.code as code',
        'r.can_access_cms as "canAccessCms"',
        'r.is_active as "isActive"',
        "COALESCE(json_agg(DISTINCT jsonb_build_object('action', permission.action, 'subject', permission.subject)), '[]') as permissions",
      ])
      .leftJoin('r.permissionRoles', 'permissionRoles')
      .leftJoin('permissionRoles.permission', 'permission')
      .where('r.auditMetadata.deletedAt is null')
      .groupBy('r.role_id');
  }

  async findAll(dto: QueryRoleDto) {
    const { take, page, keyword, isActive } = dto;
    const query = this.getBaseRoleQuery();

    if (isActive) {
      query.andWhere('r.isActive = :isActive', {
        isActive: isActive.toString() === 'true',
      });
    }

    if (keyword) {
      query.andWhere('LOWER(r.name) like :keyword', {
        keyword: `%${keyword.toLowerCase()}%`,
      });
    }

    const [roles, totalCount] = await Promise.all([
      query
        .orderBy('r.id', 'DESC')
        .take(take)
        .skip(getSkip({ page, take }))
        .getRawMany(),
      query.getCount(),
    ]);

    return new PaginationDto(roles, {
      page,
      take,
      totalCount,
    } as PageMetaDto);
  }

  async findOne(id: string) {
    const role = await this.getBaseRoleQuery()
      .where('r.role_id = :id', { id })
      .getRawOne<IRole>();

    if (!role) {
      throw new BadRequestException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async create(dto: CreateRoleDto) {
    const { permissionIds, ...roleData } = dto;

    return this.roleRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const role = await transactionalEntityManager.save(
          Role,
          this.roleRepository.create(roleData),
        );

        if (permissionIds?.length) {
          const permissionRoles = permissionIds.map((permissionId) => ({
            permissionId,
            roleId: role.id,
          }));

          await transactionalEntityManager.insert(
            PermissionRole,
            permissionRoles,
          );
        }

        return role;
      },
    );
  }

  async getRole(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id, auditMetadata: { deletedAt: IsNull() } },
    });

    if (!role) {
      throw new BadRequestException(`Role not found`);
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto, userId: string) {
    const { permissionIds, ...updateData } = dto;

    return this.roleRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const role = await this.getRole(id);

        await transactionalEntityManager.delete(PermissionRole, { roleId: id });

        if (permissionIds?.length) {
          const permissionRoles = permissionIds.map((permissionId) => ({
            permissionId,
            roleId: id,
          }));

          await transactionalEntityManager.insert(
            PermissionRole,
            permissionRoles,
          );
        }

        await transactionalEntityManager.update(Role, id, {
          ...updateData,
          auditMetadata: { updatedById: userId },
        });

        return role;
      },
    );
  }

  async delete(input: DeleteRoleDto, userId: string) {
    const { ids } = input;

    if (ids.length === 0) {
      return;
    }

    return this.roleRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await Promise.all(ids.map((id) => this.findOne(id)));

        await transactionalEntityManager.update(
          Role,
          { id: In(ids) },
          {
            auditMetadata: {
              deletedAt: dayjs().format(),
              deletedById: userId,
            },
          },
        );

        await transactionalEntityManager.delete(PermissionRole, {
          roleId: In(ids),
        });
      },
    );
  }
}
