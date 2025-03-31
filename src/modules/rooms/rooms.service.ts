import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/rooms.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({
      data: createRoomDto,
    });
  }

  findAll(page: number, pageSize: number, showDeleted: boolean = false) {
    return this.prisma.room.findMany({
      where: {
        deletedAt: showDeleted ? undefined : null,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: {
        id,
      },
      data: updateRoomDto,
    });
  }

  remove(id: number) {
    return this.prisma.room.delete({
      where: {
        id,
      },
    });
  }

  softRemove(id: number) {
    return this.prisma.room.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
