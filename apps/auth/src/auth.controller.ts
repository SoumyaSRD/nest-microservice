import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { from, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { DUser } from './decorators/user.decorator';
import { UserDocument } from './users/models/user.scema';
import { LoginDto } from './users/dto/login.dto';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  // @UseGuards(AuthGuard('local'))
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({
    type: LoginDto
  })
  login(@Req() user: UserDocument, @Res({ passthrough: true }) response: Response) {
    console.log("_____login_______________", user);

    return from(this.authService.login(user, response)).pipe(
      tap(() => response.send(user))
    );
  }
}
