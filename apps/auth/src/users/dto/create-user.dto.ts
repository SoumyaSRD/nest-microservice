import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
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
        description: 'Strong password that contains at least one special character',
        name: 'password',
        default: 'John@123',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ description: 'Full name', name: 'name', default: 'john doe' })
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
type User = Omit<CreateUserDto, "password">
export class UserDto extends OmitType(CreateUserDto, ['password'] as const) {
    @ApiProperty({
        description: 'User ID',
        name: '_id',
        default: '123456bgj',
    })
    @IsString()
    _id: string;

    @Exclude()
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

    @ApiProperty({ description: 'Full name', name: 'name', default: 'john doe' })
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
    @ApiProperty({ type: [UserFilterResponseDto] })
    users: UserFilterResponseDto[];

    @ApiProperty({ description: 'Total count of users', name: 'count', default: 0 })
    @IsNumber()
    count: number;
}

export class UserFilterDto extends UserFilterResponseDto {
    @ApiProperty({ description: 'Page number', name: 'page', default: 1 })
    @IsNotEmpty()
    @IsNumber()
    page: number;

    @ApiProperty({ description: 'Data limit', name: 'limit', default: 10 })
    @IsNotEmpty()
    @IsNumber()
    limit: number;
}
