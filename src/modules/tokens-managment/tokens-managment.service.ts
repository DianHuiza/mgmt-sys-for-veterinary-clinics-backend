import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/enums/role.enum';
import { authConstants } from '../auth/constants';
import { env } from 'src/env';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokensManagmentService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  generateNewAuthToken(userId: number, userName: string, userRole: Role) {
    return this.jwt.sign(
      { sub: userId, name: userName, role: userRole },
      {
        secret: env.JWT_SECRET,
        expiresIn: authConstants.TOKEN_DURATION / 1000,
      },
    );
  }
  generateNewRefreshToken(sub, jti) {
    return this.jwt.sign(
      { sub, jti },
      {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: authConstants.REFRESH_TOKEN_DURATION / 1000,
      },
    );
  }
  async updateRefreshToken(
    userId: number,
    refreshToken: string,
    jti: string,
  ) {
    console.log(refreshToken.length)
    await this.prisma.refreshTokens.upsert({
      where: {
        userId: userId,
      },
      update: {
        token: refreshToken,
        jti,
      },
      create: {
        user: {
          connect: {
            id: userId,
          },
        },
        token: refreshToken,
        jti,
      },
    });
  }
  async generateAndSaveTokens(
    userId: number,
    userName: string,
    userRole: Role,
  ) {
    const token = this.generateNewAuthToken(userId, userName, userRole);
    const jti = uuidv4();
    const refreshToken = this.generateNewRefreshToken(userId, jti);

    await this.updateRefreshToken(userId, refreshToken, jti);
    return {
      token: `Bearer ${token}`,
      refreshToken: `Bearer ${refreshToken}`,
      user: { name: userName, role: userRole, id: userId },
    };
  }

  verifyAuthToken(token) {
    try {
      const payload = this.jwt.verify(token, { secret: env.JWT_SECRET });
      return payload;
    } catch (e) {
      return undefined;
    }
  }

  verifyRefreshToken(token) {
    try {
      const payload = this.jwt.verify(token, { secret: env.JWT_REFRESH_SECRET });
      return payload;
    } catch (e) {
      return undefined;
    }
  }

  verifyWsToken(token) {
    return this.jwt.verify(token, { secret: env.JWT_SECRET });
  }
}
