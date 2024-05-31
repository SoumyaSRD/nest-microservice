import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Observable, catchError, from, map } from 'rxjs';
import { IUserRepository } from './user-interface/IUserRepoInterfaces/IUserRepo';
import { IuserService } from './user-interface/UserServiceInterfaces/IUserService';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IuserService {
    iuserRepo: IUserRepository
    constructor(private readonly userRepo: UserRepository) {
        this.iuserRepo = userRepo;
    }


    create(createUserDto: CreateUserDto) {

        return from(this.userRepo.findOne({ email: createUserDto.email }, 'password').pipe(
            map((foundUser) => {
                if (foundUser?.email) {
                    throw new ConflictException('Email already exists');
                }
                return from(
                    this.userRepo.create({
                        ...createUserDto,
                        password: bcrypt.hashSync(createUserDto.password, 10),
                        createdOn: new Date(),
                        modifiedOn: new Date(),
                    }),
                ).pipe(
                    map((res) => {
                        delete res.password;
                        return res;
                    }),
                );
            }),
            catchError((error) => {
                if (error.response.statusCode === 404) {
                    return from(
                        this.userRepo.create({
                            ...createUserDto,
                            password: bcrypt.hashSync(createUserDto.password, 10),
                            createdOn: new Date(),
                            modifiedOn: new Date(),
                        }),
                    ).pipe(
                        map((res) => {
                            delete res.password;
                            return res;
                        }),
                    );
                }
                if (error.response.statusCode === 409)
                    throw new ConflictException('Email already exists');
                throw new BadRequestException();
            }),
        ));
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
