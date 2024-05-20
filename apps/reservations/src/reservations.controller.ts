import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from './reservations/dto/update-reservation.dto';
import { Observable, from } from 'rxjs';

@Controller('reservations')
@ApiTags('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  create(@Body() createReservationDto: CreateReservationDto): Observable<any> {
    return from(this.reservationsService.create(createReservationDto));
  }

  @Get()
  findAll(): Observable<any> {
    return from(this.reservationsService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<any> {
    return from(this.reservationsService.findOne(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto): Observable<any> {
    return from(this.reservationsService.update(id, updateReservationDto));
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<any> {
    return from(this.reservationsService.remove(id));
  }
}
