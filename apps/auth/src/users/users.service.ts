import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, from } from 'rxjs';
import { UserRepository } from './user.repository';
import { v4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly userRepo: UserRepository) { }



    create(createUserDto: CreateUserDto): Observable<any> {
        return from(this.userRepo.create({
            ...createUserDto,
            createdOn: new Date(),
            modifiedOn: new Date()
        }))
    }
}
