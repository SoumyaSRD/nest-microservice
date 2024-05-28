import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from './users/models/user.scema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable, catchError, from, map, of, switchMap, tap, throwError } from 'rxjs';
import * as bcrypt from 'bcrypt'
import { UserRepository } from './users/user.repository';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService, private jwtService: JwtService, private readonly userRepo: UserRepository) {

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

  validateUser(email: string, pass: string): Observable<any> {
    // Use RxJS to handle asynchronous user validation
    return from(this.userRepo.findUserByEmail(email)).pipe(
      map((user) => {
        if (user && bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      })
    );
  }
  /*   validateUser(email: string, password: string): Observable<any> {
      console.error(email, password);
  
      return from(this.userRepo.findUserByEmail(email)).pipe(
        switchMap(user => {
          console.log("user", user);
  
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
    } */

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
  login(user: UserDocument, response: Response<any>) {
    const tokenPayload = {
      userId: user._id
    };

    return of(tokenPayload).pipe(
      switchMap(payload => {
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));
        const token = this.jwtService.sign(payload);
        return of({ token, expires });
      }),
      tap(({ token, expires }) => {
        response.cookie('Authentication', token, {
          httpOnly: true,
          expires
        });
      })
    );
  }



}
