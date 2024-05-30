import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt'
import { IuserService } from './user-interface/UserServiceInterfaces/IUserService';
import { IUserRepository } from './user-interface/IUserRepoInterfaces/IUserRepo';

@Injectable()
export class UsersService implements IuserService {
    iuserRepo: IUserRepository
    constructor(private readonly userRepo: UserRepository) {
        this.iuserRepo = userRepo;
    }


    findAll(): Observable<any> {
        return from(this.userRepo.find({}));
    }

    findOne(_id: string): Observable<any> {
        return from(this.iuserRepo.findOne({ _id }));
    }

    findOneByEmail(email: string): Observable<any> {
        return from(this.iuserRepo.findOne({ email }))
    }

    findAllWithFiltersAndPagination(filter: any, page: number, limit: number): Observable<any> {
        return this.userRepo.findAllWithFiltersAndPagination(filter, page, limit)
    }
}
