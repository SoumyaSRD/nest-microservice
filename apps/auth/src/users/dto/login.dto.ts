import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class LoginDto {
    @ApiProperty({
        description: 'Email id',
        name: 'email',
        default: 'john@email.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Enter Password',
        name: 'password',
        default: 'John@123',
    })
    @IsNotEmpty()
    password: string;
}