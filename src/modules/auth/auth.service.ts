import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/env';
import { Role } from 'src/enums/role.enum';
import { authConstants } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { TokensManagmentService } from '../tokens-managment/tokens-managment.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensManagment: TokensManagmentService,
  ) {}

  async onModuleInit() {
    const admin = await this.prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });

    if (!admin) {
      console.log('creating admin');
      await this.prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@admin.com',
          role: Role.ADMIN,
          password: bcrypt.hashSync('admin', 10),
        },
      });
    }
  }

  async login(email: string, password: string) {
    console.log(email, password);
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        RefreshTokens: true,
      },
    });

    if (!user) throw new BadRequestException();

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException();
    }

    return this.tokensManagment.generateAndSaveTokens(user.id, user.name, user.role);
  }

  async refreshToken(providedRefreshToken: string) {
    let userId: number
    let payload
    try {
      payload = this.tokensManagment.verifyRefreshToken(providedRefreshToken);
      userId = payload.sub;
    } catch (e) {
      return undefined;
    }

    const tokenData = await this.prisma.refreshTokens.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });
    console.log(tokenData?.jti, payload.jti)
    if (!tokenData || tokenData?.jti !== payload.jti) {
      console.log('invalid refresh token');
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { user } = tokenData;

    return this.tokensManagment.generateAndSaveTokens(user.id, user.name, user.role);
  }

  verifyWsToken(token) {
    return this.tokensManagment.verifyWsToken(token);
  }

  blockToken(userId: number) {
    return this.prisma.refreshTokens.delete({
      where: {
        userId: userId,
      },
    });
  }
}
