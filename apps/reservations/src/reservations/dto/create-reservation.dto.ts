import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateReservationDto {
    @ApiProperty({ description: '', name: 'startDate', default: new Date() })
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({ description: '', name: 'endDate', default: new Date() })
    @IsDate()
    @Type(() => Date)
    endDate: Date


    @ApiProperty({ description: '', name: 'placeId', default: 1123 })
    @IsString()
    @IsNotEmpty()
    placeId: string;

    @ApiProperty({ description: '', name: 'invoiceId', default: 1234 })
    @IsString()
    @IsNotEmpty()
    invoiceId: string;
}
