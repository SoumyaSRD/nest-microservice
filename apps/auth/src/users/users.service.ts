import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    create(createReservationDto: CreateUserDto) {
        throw new Error('Method not implemented.');
    }
}
