import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, from } from 'rxjs';
import { UserRepository } from './user.repository';
import { v4 } from 'uuid';

@Injectable()
export class UsersService {

    constructor(private readonly userRepo: UserRepository) { }


    create(createUserDto: Partial<CreateUserDto>): Observable<any> {
        let modifiedUserDto: any = { ...createUserDto, createdOn: new Date(), modifiedOn: new Date(), _id: v4() }
        return from(this.userRepo.create(modifiedUserDto))
    }
}
