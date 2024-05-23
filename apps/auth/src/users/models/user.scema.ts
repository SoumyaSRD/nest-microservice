import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
    @Prop()
    email: string

    @Prop({ select: false })
    @Exclude({ toPlainOnly: true })
    password: string;

    @Prop()
    name: string;

    @Prop()
    createdOn: Date;

    @Prop()
    modifiedOn: Date;


}
export const UserScema = SchemaFactory.createForClass(UserDocument)

