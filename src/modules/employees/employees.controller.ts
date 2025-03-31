import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import {
  CreateEmployeeDto,
  listingEmployeeQuerySchema,
  UpdateEmployeeDto,
} from './dto/employee.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ListingClientQueryParams } from '../clients/dto/client.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query(new ZodPipe(listingEmployeeQuerySchema))
    queryParams: ListingClientQueryParams,
  ) {
    return this.employeesService.findAll(
      queryParams.page,
      queryParams.pageSize,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }

  @Patch('remove/soft/:id')
  @Roles(Role.ADMIN)
  softDelete(@Param('id', new ParseIntPipe()) id: number) {
    return this.employeesService.softRemove(id);
  }
}
