import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CHECK_PERMISSION_KEY } from '@/modules/auth/decorators/check-permissions.decorator';
import { IS_PUBLIC_KEY } from '@/modules/auth/decorators/public.decorator';
import {
  AppAbility,
  CaslAbilityFactory,
  PossibleAbilities,
} from '@/shared/casl/casl-ability.factory';
import {
  IRequestWithUser,
  PermissionActionEnum,
  PermissionSubjectEnum,
} from '@/types/auth.type';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.get<
      PossibleAbilities[] | undefined
    >(CHECK_PERMISSION_KEY, context.getHandler()) ?? [
      [PermissionActionEnum.Manage, PermissionSubjectEnum.All],
    ];
    const { user } = context.switchToHttp().getRequest<IRequestWithUser>();

    const ability = this.caslAbilityFactory.createForUser(user);

    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }

  private isAllowed(
    ability: AppAbility,
    permission: PossibleAbilities,
  ): boolean {
    return ability.can(...permission);
  }
}
