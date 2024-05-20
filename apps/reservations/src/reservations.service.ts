import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from './reservations/dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { Observable, from } from 'rxjs';

@Injectable()
export class ReservationsService {

  constructor(private readonly reservationsRepository: ReservationRepository) { }

  create(createReservationDto: CreateReservationDto): Observable<any> {
    return from(this.reservationsRepository.create({ ...createReservationDto, timestamp: new Date(), userId: '123' }))
  }

  findAll(): Observable<any> {
    return from(this.reservationsRepository.find({}));
  }

  findOne(_id: string): Observable<any> {
    return from(this.reservationsRepository.findOne({ _id }));
  }

  update(_id: string, updateReservationDto: UpdateReservationDto): Observable<any> {
    return from(this.reservationsRepository.findOneAndUpdate({ _id }, { $set: updateReservationDto }));
  }

  remove(_id: string): Observable<any> {
    return from(this.reservationsRepository.findOneAndDelete({ _id }));
  }
}
