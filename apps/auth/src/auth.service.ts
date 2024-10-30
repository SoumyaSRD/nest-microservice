import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import {
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserRepository } from './users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) { }

  getUser(user): Observable<string> {
    return this.userRepo.find(user.id);
  }


  validateUser(email: string, password: string): Observable<any> {
    return from(this.userRepo.findOne({ email }, 'password')).pipe(
      switchMap(async (user) => {
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        let isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          throw new UnauthorizedException('User is Not Valid');
        }
        return user;
      }),

      catchError((error) => throwError(() => error)),
    );
  }

  /**
   * @description: Method description Below
   *  Define the login function which takes a user document and response object as arguments.
   * Creating a payload containing the user's ID to be used in the JWT token.
   * Creating an observable from the tokenPayload using the 'of' function.
   * Using 'switchMap' to handle the asynchronous operation of signing the token.
   * Creating a new Date object to calculate the expiration time of the token.
   * Setting the expiration time based on the JWT_EXPIRATION configuration.
   * Signing the token with the payload using the jwtService.
   * Returning an observable of the token and its expiration time.
   * Using 'tap' to perform a side effect without altering the observable's data.
   * The cookie is not accessible via client-side scripts.
   * Setting the expiration time for the cookie.
   * Setting a cookie on the response object with the signed JWT token.
   **/
  login(user: any, response: Response<any>) {

    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    return of(tokenPayload).pipe(
      switchMap((payload) => {
        const expires = new Date();
        expires.setSeconds(
          expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
        );
        const token = this.jwtService.sign(payload);
        return of({ token, expires });
      }),
      tap(({ token, expires }) => {
        response.cookie('Authentication', token, {
          httpOnly: true,
          expires,
        });
      }),
    );
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepo
      .findOne({ email: createUserDto.email }, 'password')
      .pipe(
        map((foundUser) => {

          if (foundUser?.email) {
            throw new ConflictException('Email already exists');
          }
        }),
        catchError(async (error) => {
          if (error.response.statusCode === 404) {
            let data = from(
              this.userRepo.create({
                ...createUserDto,
                password: await bcrypt.hash(createUserDto.password, 10),
                createdOn: new Date(),
                modifiedOn: new Date(),
              })
            )
            return {
              data,
              message: 'User Created Successfully'
            }


          }
          if (error.response.statusCode === 409)
            throw new ConflictException('Email already exists');
          throw new BadRequestException();
        }),
      );
  }
}
