import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Observable, from } from 'rxjs';

@Controller('users')
@ApiTags('users')
export class UsersController {

  constructor(private readonly userService: UsersService) {

  }


  @Post()
  create(@Body() createReservationDto: CreateUserDto): Observable<any> {
    return from(this.userService.create(createReservationDto));
  }
  /*   
      @Get()
      findAll() {
        return this.reservationsService.findAll();
      }
    
      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.reservationsService.findOne(id);
      }
    
      @Patch(':id')
      update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
        return this.reservationsService.update(id, updateReservationDto);
      }
    
      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.reservationsService.remove(id);
      } */
}
