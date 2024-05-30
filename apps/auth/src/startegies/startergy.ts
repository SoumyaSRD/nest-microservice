import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
        });
    }

    validate(email: string, password: string): Observable<any> {
        return from(this.authService.validateUser(email, password)).pipe(
            map((user: any) => {
                if (!user) {
                    throw new UnauthorizedException();
                }
                return user;
            }),
            catchError((error) => {
                throw error;
            })
        );
    }
}
