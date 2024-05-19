import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationDocument, ReservationScema } from './reservations/models/reservation.scema';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([
    {
      name: ReservationDocument.name,
      schema: ReservationScema
    }
  ])],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule { }
