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
import { UsersService } from './users.service';
import {
  CreateUserDto,
  listingUserQuerySchema,
  UpdateUserDto,
} from './dto/users.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ListingClientQueryParams } from '../clients/dto/client.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('employees')
export class UsersController {
  constructor(private readonly employeesService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.employeesService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query(new ZodPipe(listingUserQuerySchema))
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
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.employeesService.update(+id, updateUserDto);
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
