import { AbstractRepository } from "@app/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PinoLogger } from "nestjs-pino";
import { Observable, from } from "rxjs";
import { UserDocument } from "./models/user.scema";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
    constructor(
        @InjectModel(UserDocument.name) private userModel: Model<UserDocument>, logger: PinoLogger

    ) {
        super(userModel, logger, UserRepository.name)
    }

    findUserByEmail(email): Observable<any> {
        return from(this.userModel.findOne({ email }).select('+password').exec())
    }

}