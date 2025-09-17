import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/entities';
import { IUser } from '@/types';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.user_id as id',
        'u.email as email',
        'u.first_name as "firstName"',
        'u.last_name as "lastName"',
        'u.avatar as avatar',
        'u.email_verified as "emailVerified"',
        'u.provider as provider',
        'u.created_at as "createdAt"',
        'u.updated_at as "updatedAt"',
        "json_build_object('id', r.role_id, 'name', r.name, 'code', r.code, 'canAccessCms', r.can_access_cms, 'isActive', r.is_active, 'permissions', COALESCE(json_agg(DISTINCT jsonb_build_object('action', permission.action, 'subject', permission.subject)), '[]')) as role",
      ])
      .leftJoin('u.role', 'r', 'r.auditMetadata.deletedAt is null')
      .leftJoin('r.permissionRoles', 'permissionRoles')
      .leftJoin('permissionRoles.permission', 'permission')
      .where('u.auditMetadata.deletedAt is null')
      .andWhere('u.user_id = :userId', { userId })
      .groupBy('u.user_id, r.role_id')
      .getRawOne<IUser>();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }
}
