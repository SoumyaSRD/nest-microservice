import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { from, catchError, throwError } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
/* The CustomStrategy class extends PassportStrategy and validates user credentials using a
UsersService.  'CustomStrategy' is By degault set To local*/
export class CustomStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(private readonly configService: ConfigService, private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    validate(email: string, password: string) {
        return from(this.userService.validateUser(email, password)).pipe(
            catchError(error => throwError(() => new UnauthorizedException()))
        );
    }

}