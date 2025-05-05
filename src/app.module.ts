import { Module } from '@nestjs/common';
import { ClientsModule } from './modules/clients/clients.module';
import { PetsModule } from './modules/pets/pets.module';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { RoomsSocketModule } from './modules/rooms-socket/rooms-socket.module';
import { TokensManagmentModule } from './modules/tokens-managment/tokens-managment.module';
@Module({
  imports: [
    ClientsModule,
    PetsModule,
    UsersModule,
    RoomsModule,
    AppointmentsModule,
    AuthModule,
    PrismaModule,
    RoomsSocketModule,
    TokensManagmentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
