import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(private readonly userRepo: UserRepository) { }


    /*    validateUser(email: string, password: string): Observable<any> {
           console.error(email, password);
   
           return from(this.userRepo.findUserByEmail(email)).pipe(
               switchMap(user => {
                   if (!user) {
                       throw new UnauthorizedException('User not found');
                   }
                   return from(bcrypt.compare(password, user.password)).pipe(
                       switchMap(isValidPassword => {
                           if (!isValidPassword) {
                               throw new UnauthorizedException('User is Not Valid');
                           }
                           return user;
                       })
                   );
               }),
               catchError(error => throwError(() => error))
           );
       }
    */

    create(createUserDto: CreateUserDto) {
        return from(this.userRepo.create({
            ...createUserDto,
            password: bcrypt.hashSync(createUserDto.password, 10),
            createdOn: new Date(),
            modifiedOn: new Date()
        })).pipe(
            map(res => {
                delete res.password;
                return res;
            })
        );
    }

    findAll(): Observable<any> {
        return from(this.userRepo.find({}));
    }

    findOne(_id: string): Observable<any> {
        return from(this.userRepo.findOne({ _id }));
    }

    findOneByEmail(email: string): Observable<any> {
        return from(this.userRepo.findOne({ email }))
    }

    findAllWithFiltersAndPagination(filter: any, page: number, limit: number): Observable<any> {
        return this.userRepo.findAllWithFiltersAndPagination(filter, page, limit)
    }
}
