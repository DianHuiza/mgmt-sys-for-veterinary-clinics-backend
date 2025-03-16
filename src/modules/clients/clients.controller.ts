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

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(
    @Query(new ZodPipe(listingClientSchema)) query: ListingClientQueryParams,
  ) {
    return this.clientsService.findAll(query.page, query.pageSize);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.clientsService.remove(id);
  }
}
