import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from 'uuid';
@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {


    @Prop()
    email: string

    @Prop()
    password: string;

    @Prop()
    name: string;

    @Prop({ default: new Date() })
    createdOn: Date;

    @Prop({ default: new Date() })
    modifiedOn: Date;


}
export const UserScema = SchemaFactory.createForClass(UserDocument)