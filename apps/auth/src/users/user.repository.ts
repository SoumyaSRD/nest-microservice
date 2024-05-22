import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PinoLogger } from "nestjs-pino";
import { UserDocument } from "./models/user.scema";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
    constructor(
        @InjectModel(UserDocument.name) reservationModel: Model<UserDocument>, logger: PinoLogger

    ) {
        super(reservationModel, logger, UserRepository.name)
    }

}