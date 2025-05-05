import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { RoomsService } from '../rooms/rooms.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'rooms' })
export class RoomsSocketGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly roomsService: RoomsService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.wsToken;
    if (!token) {
      client.disconnect(true);
    }
    const user = await this.authService.verifyWsToken(token);

    if (!user) {
      client.disconnect(true);
    }

    client['user'] = user;
  }

  async handleDisconnect(client: any) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('assingPet')
  async assignPet(@MessageBody() body) {
    try {
      const room = await this.roomsService.assignPet(body.roomId, body.petId);
      this.server.to(`room-${room.id}`).emit('roomUpdate', body.clientId);
      this.server.emit('roomListUpdate', room);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('createRoom')
  async createRoomSession(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    const room = await this.roomsService.assignEmployee(body.roomId, socket.user.id);
    socket['roomId'] = room.id;
    this.server.emit('roomListUpdate', room);
  }

  @SubscribeMessage('closeAppointment')
  closeAppointment(@MessageBody() body: any) {
    const room = this.roomsService.unassignPet(body.roomId);

  }

  @SubscribeMessage('closeRoom')
  closeRoom(@MessageBody() body: any) {
    const room = this.roomsService.unassignEmployee(body.roomId);
  }
}
