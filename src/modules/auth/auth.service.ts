import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/env';
import { Role } from 'src/enums/role.enum';
import { authConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.prisma.employee.findUnique({
      where: {
        email,
      },
      include: {
        RefreshTokens: true,
      },
    });

    if (!user) throw new BadRequestException();

    if (!bcrypt.compareSync(user.password, password)) {
      throw new BadRequestException();
    }

    const { token, refreshToken } = this.generateNewTokens(
      user.id,
      user.name,
      user.role,
    );

    this.updateRefreshToken(user.id, refreshToken);

    return {
      token: `Bearer ${token}`,
      refreshToken: `Bearer ${refreshToken}`,
      user: { name: user.name, role: user.role, sub: user.id },
    };
  }

  async refreshToken(userId, providedRefreshToken) {
    const tokenData = await this.prisma.refreshTokens.findFirst({
      where: {
        token: providedRefreshToken,
        employeeId: userId,
      },
      include: {
        employee: true,
      },
    });
    if (!tokenData || tokenData?.token !== providedRefreshToken) {
      throw new UnauthorizedException();
    }

    const { employee } = tokenData;

    const { token, refreshToken: newRefreshToken } = this.generateNewTokens(
      employee.id,
      employee.name,
      employee.role,
    );

    this.updateRefreshToken(userId, newRefreshToken);

    return {
      token: `Bearer ${token}`,
      refreshToken: `Bearer ${newRefreshToken}`,
      user: { name: employee.name, role: employee.role, id: employee.id },
    };
  }

  generateNewTokens(userId: number, userName: string, userRole: Role) {
    return {
      token: this.jwt.sign(
        { sub: userId, name: userName, rol: userRole },
        {
          secret: env.JWT_SECRET,
          expiresIn: authConstants.TOKEN_DURATION / 1000,
        },
      ),
      refreshToken: this.jwt.sign(
        { sub: userId },
        {
          secret: env.JWT_SECRET,
          expiresIn: authConstants.REFRESH_TOKEN_DURATION / 1000,
        },
      ),
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.refreshTokens.upsert({
      where: {
        employeeId: userId,
      },
      update: {
        token: refreshToken,
      },
      create: {
        employeeId: userId,
        token: refreshToken,
      },
    });
  }

  verifyToken(token) {
    return this.jwt.verify(token, { secret: env.JWT_SECRET });
  }

  blockToken(userId: number) {
    return this.prisma.refreshTokens.delete({
      where: {
        employeeId: userId,
      },
    });
  }
}
