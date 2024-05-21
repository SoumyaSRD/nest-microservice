import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, from } from 'rxjs';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {

    constructor(private readonly userRepo: UserRepository) { }


    create(createUserDto: CreateUserDto): Observable<any> {
        return from(this.userRepo.create(createUserDto))
    }
}
