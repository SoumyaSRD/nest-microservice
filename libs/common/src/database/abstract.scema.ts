import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypeOptions, SchemaTypes, Types } from "mongoose";

@Schema()
export class AbstractDocument {
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId
}