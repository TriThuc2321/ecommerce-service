import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '@/shared/dto';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Role name required' })
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Role code required' })
  code!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  permissionIds?: string[];

  @ApiProperty()
  canAccessCMS!: boolean;
}

export class DeleteRoleDto {
  @ApiProperty()
  ids!: string[];
}

export class QueryRoleDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly isActive?: boolean;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
