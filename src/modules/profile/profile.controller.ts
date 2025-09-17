import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CheckPermissions, GetUser } from '../auth/decorators';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @CheckPermissions()
  getProfile(@GetUser('id') userId: string) {
    return this.profileService.getProfile(userId);
  }
}
