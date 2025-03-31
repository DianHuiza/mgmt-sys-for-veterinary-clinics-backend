import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto, UpdatePetDto } from './dto/pets.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPetDto: CreatePetDto) {
    return this.prisma.pet.create({
      data: createPetDto,
    });
  }

  findAll(page: number, pageSize: number, showDeleted: boolean = false) {
    return this.prisma.pet.findMany({
      where: {
        deletedAt: showDeleted ? undefined : null,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findOne(id: number) {
    return this.prisma.pet.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return this.prisma.pet.update({
      where: {
        id,
      },
      data: updatePetDto,
    });
  }

  remove(id: number) {
    return this.prisma.pet.delete({
      where: {
        id,
      },
    });
  }

  softRemove(id: number) {
    return this.prisma.pet.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
