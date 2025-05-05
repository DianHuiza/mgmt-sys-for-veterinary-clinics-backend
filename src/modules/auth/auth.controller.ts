import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { LoginDTO, loginSchema } from './dto/auth.dto';
import { Response } from 'express';
import { authConstants, TOKEN_NAME } from './constants';
import { RequestWithUser } from 'src/types';
import { TokensManagmentService } from '../tokens-managment/tokens-managment.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly tokensManagment: TokensManagmentService) {}

  @Post('login')
  async login(
    @Body(new ZodPipe(loginSchema)) body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginData = await this.authService.login(body.email, body.password);
    res.cookie(TOKEN_NAME.AUTHORIZATION, loginData.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: authConstants.TOKEN_DURATION,
    });
    res.cookie(TOKEN_NAME.REFRESH, loginData.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: authConstants.REFRESH_TOKEN_DURATION,
    });

    return loginData.user;
  }

  @Get('refresh')
  async refreshToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.cookies[TOKEN_NAME.REFRESH]) {
      throw new BadRequestException
    }
    const token = req.cookies[TOKEN_NAME.REFRESH].split(' ')[1];
    const loginData = await this.authService.refreshToken(token);

    if (!loginData) {
      throw new BadRequestException();
    }

    res.cookie(TOKEN_NAME.AUTHORIZATION, loginData.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: authConstants.TOKEN_DURATION,
    });
    res.cookie(TOKEN_NAME.REFRESH, loginData.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: authConstants.REFRESH_TOKEN_DURATION,
    });

    return loginData.user;
  }

  @Get('verify')
  async verifyToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return {
      id: req.user?.sub,
      name: req.user?.name,
      role: req.user?.role,
    };
  }
}
