import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Response } from 'express';
import { IsNull, Repository } from 'typeorm';

import { COOKIE_OPTIONS } from '@/configs/common.config';
import { ENV } from '@/configs/env.config';
import { PermissionRole, Role, User } from '@/entities';
import { MailService } from '@/shared/mail/mail.service';
import {
  IEmailRegisterContext,
  IJwtPayload,
  ISendEmail,
  IThirdPartyLoginUser,
  Provider,
  RoleEnum,
  UserErrorEnum,
} from '@/types';
import type { IRequestWithUser, RoleType } from '@/types';
import {
  comparePasswords,
  hashPassword,
  SUCCESS_MESSAGE,
} from '@/utils/common.util';

import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PermissionRole)
    private readonly permissionRoleRepository: Repository<PermissionRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly mailService: MailService,
  ) {}

  private async generateToken({
    payload,
    secret,
    expiresIn,
  }: {
    payload: Record<string, unknown>;
    secret: string;
    expiresIn: number;
  }) {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  private async verifyUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await this.userRepository.findOne({
      where: { email, auditMetadata: { deletedAt: IsNull() } },
      select: {
        password: true,
        email: true,
        id: true,
        roleId: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.emailVerified) {
      throw new HttpException(
        {
          message: 'Email not verified',
          code: UserErrorEnum.EMAIL_NOT_VERIFIED,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidPassword = await comparePasswords({
      password,
      hashedPassword: user.password ?? '',
    });

    if (!isValidPassword) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  private async getAccessAndRefreshToken({
    user,
    res,
    isThirdParty,
  }: {
    user: User;
    res: Response;
    isThirdParty?: boolean;
  }) {
    const { email, roleId, id } = user;

    if (!roleId) {
      throw new BadRequestException(`User doesn't have a role`);
    }

    const [permissionDb, role] = await Promise.all([
      this.permissionRoleRepository.find({
        select: ['permission'],
        where: { roleId },
        relations: ['permission'],
      }),
      this.roleRepository.findOneBy({
        id: roleId,
        auditMetadata: { deletedAt: IsNull() },
      }),
    ]);

    const permissions = permissionDb.map((p) => ({
      action: p.permission.action,
      subject: p.permission.subject,
    }));

    const payload = {
      email: email!,
      roleId: roleId as RoleType,
      id,
      permissions,
      canAccessCms: role?.canAccessCms ?? false,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken({
        payload,
        secret: ENV.JWT.SECRET,
        expiresIn: ENV.JWT.ACCESS_TOKEN_EXPIRATION_TIME,
      }),
      this.generateToken({
        payload,
        secret: ENV.JWT.SECRET_REFRESH,
        expiresIn: ENV.JWT.REFRESH_TOKEN_EXPIRATION_TIME,
      }),
    ]);

    res.cookie(ENV.COOKIE.ACCESS_TOKEN_NAME, accessToken, COOKIE_OPTIONS);
    res.cookie(ENV.COOKIE.REFRESH_TOKEN_NAME, refreshToken, COOKIE_OPTIONS);

    if (isThirdParty) {
      res.redirect(ENV.DOMAIN.WEBSITE);

      return;
    }

    return SUCCESS_MESSAGE({
      message: 'Login successfully',
    });
  }

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;
    const user = await this.verifyUser({ email, password });

    return this.getAccessAndRefreshToken({
      user,
      res,
      isThirdParty: false,
    });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, res: Response) {
    const { refreshToken } = refreshTokenDto;
    const { id } = await this.jwtService.verifyAsync<IJwtPayload>(
      refreshToken,
      {
        secret: ENV.JWT.SECRET_REFRESH,
      },
    );
    const user = await this.userRepository.findOne({
      where: { id, auditMetadata: { deletedAt: IsNull() } },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.getAccessAndRefreshToken({
      user,
      res,
      isThirdParty: false,
    });
  }

  async thirdPartyLogin(
    req: IRequestWithUser,
    res: Response,
    provider: Provider,
  ) {
    if (!req.user) {
      throw new BadRequestException(
        `No user from ${provider}`,
        `${provider.toUpperCase()}_ERROR`,
      );
    }

    const { email, firstName, lastName } = req.user as IThirdPartyLoginUser;

    const where = [
      ...(email ? [{ email, auditMetadata: { deletedAt: IsNull() } }] : []),
    ];

    const users = await this.userRepository.find({
      where,
    });

    let userCreate;

    if (!users[0]) {
      userCreate = await this.userRepository.save({
        email,
        firstName,
        lastName,
        roleId: RoleEnum.USER,
        password: '',
        provider,
        createdAt: dayjs(),
      });
    }

    return this.getAccessAndRefreshToken({
      user: userCreate ?? users[0]!,
      res,
      isThirdParty: true,
    });
  }

  async checkEmailUsed(email: string) {
    const isEmailUsed = await this.userRepository.exists({
      where: { email, auditMetadata: { deletedAt: IsNull() } },
    });

    if (isEmailUsed) {
      throw new HttpException('Email already used', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
      auditMetadata: {
        deletedAt: IsNull(),
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async register(dto: RegisterDto) {
    const { password, email, firstName, lastName } = dto;

    await this.checkEmailUsed(email);

    try {
      await this.userRepository.save(
        this.userRepository.create({
          ...dto,
          roleId: RoleEnum.USER,
          provider: Provider.LOCAL,
          emailVerified: false,
          password: await hashPassword(password),
        }),
      );

      const emailOptions: ISendEmail = {
        subject: 'Active Account ✔',
        to: email,
        template: 'register',
        context: {
          username:
            ([firstName, lastName].filter(Boolean).join(' ') ||
              email.split('@')[0]) ??
            '',
          activeUrl: `${ENV.DOMAIN.SERVER}/api/auth/active-account/example-code`,
        } as IEmailRegisterContext,
      };

      this.mailService.sendEmail(emailOptions);
    } catch (error) {
      throw new HttpException(
        `Send verify mail error ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  logout(res: Response) {
    res.clearCookie(ENV.COOKIE.ACCESS_TOKEN_NAME, COOKIE_OPTIONS);
    res.clearCookie(ENV.COOKIE.REFRESH_TOKEN_NAME, COOKIE_OPTIONS);

    return SUCCESS_MESSAGE<{ accessToken: string }>({
      message: 'Logout successfully',
    });
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, auditMetadata: { deletedAt: IsNull() } },
      select: {
        password: true,
        email: true,
        id: true,
        roleId: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
