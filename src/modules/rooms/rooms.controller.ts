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
import { RoomsService } from './rooms.service';
import {
  CreateRoomDto,
  ListingRoomQueryParams,
  listingRoomQuerySchema,
  UpdateRoomDto,
} from './dto/rooms.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll(
    @Query(new ZodPipe(listingRoomQuerySchema)) query: ListingRoomQueryParams,
  ) {
    return this.roomsService.findAll(query.page, query.pageSize);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.roomsService.remove(+id);
  }

  @Patch('delete/soft/:id')
  softRemove(@Param('id', new ParseIntPipe()) id: number) {
    return this.roomsService.softRemove(id);
  }
}
