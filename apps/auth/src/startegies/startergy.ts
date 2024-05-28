import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { from, catchError, throwError, Observable, map } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private configService: ConfigService) {


        super({
            usernameField: 'email',

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET'),

        });
    }

    validate(email: string, password: string): Observable<any> {
        console.log("validate", email);

        return this.authService.validateUser(email, password).pipe(
            map((user) => {
                if (!user) {
                    throw new UnauthorizedException();
                }
                return user;
            })
        );
    }
}