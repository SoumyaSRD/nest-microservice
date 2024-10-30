import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, catchError, from, map } from 'rxjs';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { IUserRepository } from './user-interface/IUserRepoInterfaces/IUserRepo';
import { IuserService } from './user-interface/UserServiceInterfaces/IUserService';
import { UserRepository } from './user.repository';

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

    findAll(): Observable<UserDto[]> {
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

    updateUser(user: UserDto) {
        return this.userRepo.findOneAndUpdate({ _id: user._id }, user)
    }

    deleteUser(_id: string) {
        return this.userRepo.findOneAndDelete({ _id })
    }
}
