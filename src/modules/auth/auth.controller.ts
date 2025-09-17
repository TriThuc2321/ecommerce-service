import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

import { AuthService } from '@/modules/auth/auth.service';
import { Public } from '@/modules/auth/decorators/public.decorator';
import {
  IRequestWithUser,
  PermissionActionEnum,
  PermissionSubjectEnum,
  Provider,
} from '@/types';

import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';
import { CheckPermissions, GetUser } from './decorators';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(ThrottlerGuard)
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  login(
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) signInDto: LoginDto,
  ) {
    return this.authService.login(signInDto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Token' })
  refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(refreshTokenDto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.thirdPartyLogin(req, res, Provider.GOOGLE);
  }

  @HttpCode(HttpStatus.OK)
  @CheckPermissions([PermissionActionEnum.Create, PermissionSubjectEnum.User])
  @Get('profile')
  profile(@GetUser('id') userId: string) {
    return this.authService.getUserById(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
