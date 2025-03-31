import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import {
  CreateClientDto,
  ListingClientQueryParams,
  listingClientSchema,
  UpdateClientDto,
} from './dto/client.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  findAll(
    @Query(new ZodPipe(listingClientSchema)) query: ListingClientQueryParams,
  ) {
    return this.clientsService.findAll(query.page, query.pageSize);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.clientsService.remove(id);
  }

  @Patch('remove/soft/:id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  softDelete(@Param('id', new ParseIntPipe()) id: number) {
    return this.clientsService.softRemove(id);
  }
}
