import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'Email id', name: 'email', default: 'john@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'strong passoword atlit contain a special character', name: 'password', default: 'john@123' })
    @IsStrongPassword()
    password: string;

    @ApiProperty({ description: 'john doe', name: 'name', default: 'john doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'User Created Date', name: 'createdOn', default: new Date() })
    @IsDate()
    createdOn: string

    @ApiProperty({ description: 'User Modified Date', name: 'modifiedOn', default: new Date() })
    @IsDate()
    modifiedOn: string
}