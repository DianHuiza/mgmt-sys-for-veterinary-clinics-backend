import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: createEmployeeDto,
    });
  }

  async findAll(
    page: number = 1,
    pageSize: number = 20,
    showDeleted: boolean = false,
  ) {
    return this.prisma.employee.findMany({
      where: {
        deletedAt: showDeleted ? undefined : null,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findOne(id: number) {
    return this.prisma.employee.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: {
        id,
      },
      data: updateEmployeeDto,
    });
  }

  remove(id: number) {
    return this.prisma.employee.delete({
      where: {
        id,
      },
    });
  }

  softRemove(id: number) {
    return this.prisma.employee.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
