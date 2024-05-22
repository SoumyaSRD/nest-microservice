import { IsNotEmpty, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { v4 } from "uuid";

export class UpdateUserDto extends CreateUserDto {
    @@ApiProperty({
        description: 'Id', name: 'id', default: () => v4()
    })
    @IsNotEmpty()
    @IsString()
    _id: string;
}