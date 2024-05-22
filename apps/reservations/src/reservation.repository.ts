import { AbstractRepository } from "@app/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PinoLogger } from "nestjs-pino";
import { ReservationDocument } from "./reservations/models/reservation.scema";
@Injectable()
export class ReservationRepository extends AbstractRepository<ReservationDocument> {
    // protected readonly logger: PinoLogger = new PinoLogger({ renameContext: ReservationRepository.name });

    constructor(
        @InjectModel(ReservationDocument.name) reservationModel: Model<ReservationDocument>, logger: PinoLogger

    ) {
        super(reservationModel, logger)
    }
}