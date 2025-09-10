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
import { IRequestWithUser, Provider } from '@/types';

import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';

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

  // @HttpCode(HttpStatus.OK)
  // @Post('/check-code')
  // reSendMai(@Body() dto: CodeDto) {
  //   return this.authService.verified(dto);
  // }

  // @HttpCode(HttpStatus.OK)
  // @Get('/active-account/:code')
  // activeAccount(
  //   @Param('code') code: string,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.authService.activeAccount(res, code);
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('/forgot-password')
  // @Throttle({
  //   short: { limit: 3, ttl: 20_000 },
  // })
  // forgotPassword(@Body(ValidationPipe) dto: GetPasswordDto) {
  //   return this.authService.forgotPassword(dto);
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('/reset-password')
  // resetPassword(@Body(ValidationPipe) dto: ResetPasswordDto) {
  //   return this.authService.resetPassword(dto);
  // }

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

  // @HttpCode(HttpStatus.OK)
  // @Throttle({
  //   short: { limit: 3, ttl: 20_000 },
  // })
  // @Post('re-active-account')
  // reActiveAccount(@Body() dto: ReActiveAccountDto) {
  //   return this.authService.reActiveAccount(dto);
  // }

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
  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
