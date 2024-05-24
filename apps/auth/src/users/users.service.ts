import { Injectable } from '@nestjs/common';
import { Observable, from, map } from 'rxjs';
import { CreateUserDto, UserFilterResponseDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {

    constructor(private readonly userRepo: UserRepository) { }



    create(createUserDto: CreateUserDto): Observable<any> {
        return from(this.userRepo.create({
            ...createUserDto,
            createdOn: new Date(),
            modifiedOn: new Date()
        })).pipe(map((res) => {
            delete res.password
            return res
        }))
    }

    findAll(): Observable<any> {
        return from(this.userRepo.find({}));
    }

    findOne(_id: string): Observable<any> {
        return from(this.userRepo.findOne({ _id }));
    }

    findOneByEmail(email: string): Observable<any> {
        return from(this.userRepo.findOne({ email }));
    }

    findAllWithFiltersAndPagination(filter: any, page: number, limit: number): Observable<any> {
        return this.userRepo.findAllWithFiltersAndPagination(filter, page, limit)
    }
}
