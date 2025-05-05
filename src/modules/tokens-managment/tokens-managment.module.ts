import { Module } from '@nestjs/common';
import { TokensManagmentService } from './tokens-managment.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TokensManagmentService],
  imports: [
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
  ],
  exports: [TokensManagmentService],
})
export class TokensManagmentModule {}
