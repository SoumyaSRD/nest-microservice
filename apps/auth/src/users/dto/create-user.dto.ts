import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'Email id',
        name: 'email',
        default: 'john@email.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'strong passoword atlit contain a special character',
        name: 'password',
        default: 'John@123',
    })
    @IsStrongPassword()
    password: string;

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

export class UserDto extends CreateUserDto {
    @ApiProperty({
        description: 'Email id',
        name: 'email',
        default: 'john@email.com',
    })
    @IsString()
    _id: string
    @Exclude({ toPlainOnly: true, toClassOnly: true })
    password: string;
}


export class UserFilterResponseDto {
    @ApiProperty({
        description: 'Email id',
        name: 'email',
        default: 'john@email.com',
    })
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({ description: 'john doe', name: 'name', default: 'john doe' })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({
        description: 'User Created Date',
        name: 'createdOn',
        default: new Date(),
    })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    createdOn: Date;

    @ApiProperty({
        description: 'User Modified Date',
        name: 'modifiedOn',
        default: new Date(),
    })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    modifiedOn: Date;
}

export class FilterResponseDto {
    users: UserFilterResponseDto[];
    count: number
}

export class UserFilterDto extends UserFilterResponseDto {


    @ApiProperty({ description: 'page number', name: 'page', default: 1 })
    @IsNotEmpty()
    @IsNumber()
    page: number;

    @ApiProperty({ description: 'data limit', name: 'limit', default: 10 })
    @IsNotEmpty()
    @IsNumber()
    limit: number;
}
