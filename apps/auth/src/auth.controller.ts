import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { Observable, catchError, from, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { DUser } from './decorators/user.decorator';
import { LocalAuthGuard } from './guards/auth.guard';
import { LoginDto } from './users/dto/login.dto';
import { CreateUserDto, UserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';

@Public()
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) { }

  @Get()
  getUser(@Request() req): Observable<string> {
    const accessTokenPayload: any = req.user as any;
    return this.authService.getUser(accessTokenPayload._id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  login(@DUser() user, @Res({ passthrough: true }) response: Response) {

    return from(this.authService.login(user, response));
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto): Observable<UserDto | any> {
    return from(this.authService.create(createUserDto));
  }
}
