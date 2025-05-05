import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEmployeeDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createEmployeeDto,
    });
  }

  async findAll(
    page: number = 1,
    pageSize: number = 20,
    showDeleted: boolean = false,
  ) {
    return this.prisma.user.findMany({
      where: {
        deletedAt: showDeleted ? undefined : null,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateEmployeeDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateEmployeeDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  softRemove(id: number) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
