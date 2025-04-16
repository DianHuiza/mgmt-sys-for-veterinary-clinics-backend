import { Module } from '@nestjs/common';
import { RoomsSocketGateway } from './rooms-socket.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [RoomsSocketGateway],
  imports: [RoomsModule, AuthModule],
})
export class RoomsSocketModule {}
