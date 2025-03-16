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

    return {
      token: `Bearer ${token}`,
      refreshToken: `Bearer ${refreshToken}`,
      user: { name: user.name, role: user.role, id: user.id },
    };
  }

  async refreshToken(userId, providedRefreshToken) {
    const { employee, ...refreshToken } =
      await this.prisma.refreshTokens.findFirst({
        where: {
          token: providedRefreshToken,
          employeeId: userId,
        },
        include: {
          employee: true,
        },
      });
    if (refreshToken?.token !== providedRefreshToken) {
      throw new UnauthorizedException();
    }
    const { token, refreshToken: newRefreshToken } = this.generateNewTokens(
      employee.id,
      employee.role,
      employee.name,
    );

    this.prisma.refreshTokens.update({
      where: {
        token: providedRefreshToken,
      },
      data: {
        token: newRefreshToken,
      },
    });

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

  verifyToken(token) {
    return this.jwt.verify(token, { secret: env.JWT_SECRET });
  }
}
