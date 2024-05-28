import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { from, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { DUser } from './decorators/user.decorator';
import { CustomAuthGuard } from './guards/auth.guard';
import { LoginDto } from './users/dto/login.dto';
import { UserDocument } from './users/models/user.scema';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @UseGuards(new CustomAuthGuard('local'))
  @Post('login')
  @ApiBody({
    type: LoginDto
  })
  login(@DUser() user: UserDocument, @Res({ passthrough: true }) response: Response) {
    return from(this.authService.login(user, response)).pipe(
      tap(() => response.send(user))
    );
  }
}
