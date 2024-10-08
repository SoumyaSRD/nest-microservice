import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        description: 'Email id',
        name: 'email',
        default: 'john@email.com',
    })
    @IsEmail()
    email: string;


    @ApiProperty({ description: 'john doe', name: 'name', default: 'john doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'User Created Date',
        name: 'createdOn',
        default: new Date(),
    })
    @IsDate()
    @Type(() => Date)
    createdOn: Date;

    @ApiProperty({
        description: 'User Modified Date',
        name: 'modifiedOn',
        default: new Date(),
    })
    @IsDate()
    @Type(() => Date)
    modifiedOn: Date;
}

