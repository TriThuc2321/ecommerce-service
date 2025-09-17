import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { In, IsNull, Repository } from 'typeorm';

import { User } from '@/entities';
import { PageMetaDto, PaginationDto } from '@/shared/dto';
import { IUser } from '@/types';

import {
  CreateUserDto,
  DeleteUserDto,
  QueryUserDto,
  UpdateUserDto,
} from './dto';
import { getSkip } from '@/utils/common.util';

@Injectable()
export class CmsUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private getBaseUserQuery() {
    return this.userRepository
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
        "json_build_object('id', r.role_id, 'name', r.name, 'code', r.code, 'canAccessCms', r.can_access_cms, 'isActive', r.is_active) as role",
      ])
      .leftJoin('u.role', 'r', 'r.auditMetadata.deletedAt is null')
      .where('u.auditMetadata.deletedAt is null');
  }

  async findAll(dto: QueryUserDto) {
    const { take, page, keyword } = dto;
    const query = this.getBaseUserQuery();

    if (keyword) {
      query.andWhere(
        '(LOWER(u.email) like :keyword OR LOWER(u.first_name) like :keyword OR LOWER(u.last_name) like :keyword)',
        {
          keyword: `%${keyword.toLowerCase()}%`,
        },
      );
    }

    const [users, totalCount] = await Promise.all([
      query
        .orderBy('u.updated_at', 'DESC')
        .take(take)
        .skip(getSkip({ page, take }))
        .getRawMany(),
      query.getCount(),
    ]);

    return new PaginationDto(users, {
      page,
      take,
      totalCount,
    } as PageMetaDto);
  }

  async findOne(id: string) {
    const user = await this.getBaseUserQuery()
      .where('u.user_id = :id', { id })
      .getRawOne<IUser>();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(_dto: CreateUserDto) {
    console.log(_dto);
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, auditMetadata: { deletedAt: IsNull() } },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(_id: string, _dto: UpdateUserDto, _userId: string) {
    console.log(_id, _dto, _userId);
  }

  async delete(input: DeleteUserDto, userId: string) {
    const { ids } = input;

    if (ids.length === 0) {
      return { message: 'No users to delete' };
    }

    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Validate all users exist
        await Promise.all(ids.map((id) => this.findOne(id)));

        await transactionalEntityManager.update(
          User,
          { id: In(ids) },
          {
            auditMetadata: {
              deletedAt: dayjs().format(),
              deletedById: userId,
            },
          },
        );

        return { message: `Successfully deleted ${ids.length} user(s)` };
      },
    );
  }
}
