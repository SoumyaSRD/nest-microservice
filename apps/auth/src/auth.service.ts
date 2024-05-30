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

  /**
   * The function `validateUser` takes an email and password, checks if the user exists and if the
   * password is valid, and returns an Observable with the user data or throws an
   * UnauthorizedException.
   * @param {string} email - The `validateUser` function takes in an email and a password as
   * parameters. The function then attempts to find a user in the user repository based on the provided
   * email. If the user is found, it compares the provided password with the user's password using
   * bcrypt for validation. If the password is valid
   * @param {string} password - The `validateUser` function takes an email and a password as
   * parameters. The password is a string that represents the user's password that needs to be
   * validated.
   * @returns The `validateUser` function returns an Observable that performs the following steps:
   * 1. Logs the email and password to the console.
   * 2. Calls the `findUserByEmail` method of `userRepo` to find a user by email.
   * 3. Checks if the user exists, and if not, throws an `UnauthorizedException` with the message 'User
   * not found'.
   * 4. Compares the provided
   */

  validateUser(email: string, password: string): Observable<any> {
    console.error('line 55 auth service', email, password);

    return from(this.userRepo.findUserByEmail(email)).pipe(
      switchMap((user) => {
        console.log('user', user);

        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        return from(bcrypt.compare(password, user.password)).pipe(
          switchMap((isValidPassword) => {
            if (!isValidPassword) {
              throw new UnauthorizedException('User is Not Valid');
            }
            return user;
          }),
        );
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
    };
    console.log(tokenPayload, user);

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
    return this.userRepo.findUserByEmail(createUserDto.email).pipe(
      map((foundUser) => {
        if (foundUser?.email) {
          throw new ConflictException('Email already exists');
        }
      }),
      catchError((error) => {
        console.error('Error occurred:', error.response.statusCode);
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
    );
  }
}
