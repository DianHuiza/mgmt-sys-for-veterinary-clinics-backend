import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import {
  CreateEmployeeDto,
  listingEmployeeQuerySchema,
  UpdateEmployeeDto,
} from './dto/employee.dto';
import { query } from 'express';
import { ListingClientQueryParams } from '../clients/dto/client.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(
    @Query(new ZodPipe(listingEmployeeQuerySchema))
    queryParams: ListingClientQueryParams,
  ) {
    return this.employeesService.findAll(queryParams.page, queryParams.pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
