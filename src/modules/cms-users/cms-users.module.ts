import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role, User } from '@/entities';
import { CaslModule } from '@/shared/casl/casl.module';

import { CmsUsersController } from './cms-users.controller';
import { CmsUsersService } from './cms-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), CaslModule],
  controllers: [CmsUsersController],
  providers: [CmsUsersService],
  exports: [CmsUsersService],
})
export class CmsUsersModule {}
