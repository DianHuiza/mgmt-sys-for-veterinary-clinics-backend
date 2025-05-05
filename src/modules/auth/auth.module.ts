import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/env';
import { TokensManagmentModule } from '../tokens-managment/tokens-managment.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PrismaModule,
    TokensManagmentModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
