import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointmentsOnDate = await this.prisma.appointment.findMany({
      where: { date: createAppointmentDto.date },
    });

    const isOcupated = appointmentsOnDate.some((appointment) => {
      return (
        (appointment.initTime > createAppointmentDto.initTime
          ? appointment.initTime
          : createAppointmentDto) <
        (appointment.endTime < createAppointmentDto.endTime
          ? appointment.endTime
          : createAppointmentDto.endTime)
      );
    });

    if (isOcupated) {
      throw new BadRequestException();
    }

    return this.prisma.appointment.create({
      data: createAppointmentDto,
    });
  }

  findAll(page: number, pageSize: number, showDeleted: boolean = false) {
    return this.prisma.appointment.findMany({
      skip: (pageSize - 1) * page,
      take: pageSize,
      where: { deletedAt: showDeleted ? undefined : null },
    });
  }

  findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });
  }

  remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }

  softRemove(id: number) {
    return this.prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
