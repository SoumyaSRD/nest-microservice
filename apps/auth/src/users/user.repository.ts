import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class UserRepository extends AbstractRepository<any> {
    protected readonly logger: PinoLogger = new PinoLogger({ renameContext: UserRepository.name });

    constructor(
        @InjectModel(UserRepository.name) userModel: Model<any>

    ) {
        super(userModel)
    }
}