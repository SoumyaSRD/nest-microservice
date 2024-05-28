import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from './users/models/user.scema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { of, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService, private jwtService: JwtService) {

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
