import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/rooms.dto';
import { Role } from 'src/enums/role.enum';

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
    return this.prisma.room.findUnique({
      where: {
        id,
      },
    });
  }

  async assignPet(roomId: number, petId: number) {
    const pet = await this.prisma.pet.findUnique({
      where: {
        id: petId
      }
    })

    if(!pet){
      throw new Error('Pet not found')
    }
    
    return this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        currentPet: {
          connect: {
            id: petId
          }
        }
      },
    });
  }

  unassignPet(roomId: number) {
    return this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        currentPet: {
          disconnect: true
        }
      }
    })
  }

  async assignEmployee(roomId: number, employeeId: number){
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: employeeId
      }
    })
    
    if(!employee) throw new Error('Employee not found')
    if(employee.role !== Role.DOCTOR) throw new Error('Only doctors can be assigned to rooms')

    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId
      }
    })

    if(room?.currentEmployeeId) throw new Error('Room is already assigned to an employee')

    return this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        currentEmployee: {
          connect: {
            id: employeeId
          }
        }
      },
    });
  }

  unassignEmployee(roomId: number){
    return this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        currentEmployee: {
          disconnect: true
        }
      },
    });
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
