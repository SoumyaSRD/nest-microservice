import { ApiProperty } from "@nestjs/swagger";

export class CreateReservationDto {
    // @ApiProperty({ name: 'startDate', default: new Date() })
    @ApiProperty()
    startDate: Date;

    // @ApiProperty({ name: 'endDate', default: new Date() })
    @ApiProperty()
    endDate: Date
    // @ApiProperty({ name: 'placeId', default: 1123 })
    @ApiProperty()

    placeId: string;
    // @ApiProperty({ name: 'invoiceId', default: 1234 })
    @ApiProperty()
    invoiceId: string;
}
