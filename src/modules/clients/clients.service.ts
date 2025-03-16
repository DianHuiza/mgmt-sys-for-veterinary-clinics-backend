import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: createClientDto,
    });
  }

  findAll(
    page: number = 1,
    pageSize: number = 20,
    showDeleted: boolean = false,
  ) {
    return this.prisma.client.findMany({
      where: {
        deletedAt: showDeleted ? undefined : null,
      },
      take: pageSize,
      skip: pageSize * (page - 1),
    });
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  remove(id: number) {
    return this.prisma.client.delete({
      where: { id },
    });
  }

  softRemove(id: number) {
    return this.prisma.client.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
