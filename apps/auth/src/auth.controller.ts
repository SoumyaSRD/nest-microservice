import { BadRequestException, Body, ConflictException, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { Observable, catchError, from, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { DUser } from './decorators/user.decorator';
import { LocalAuthGuard } from './guards/auth.guard';
import { LoginDto } from './users/dto/login.dto';
import { CreateUserDto, UserDto } from './users/dto/create-user.dto';

@Public()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  getUser(@Request() req): Observable<string> {
    const accessTokenPayload: any = req.user as any;
    return this.authService.getUser(accessTokenPayload._id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginDto
  })
  login(@DUser() user, @Res({ passthrough: true }) response: Response) {
    console.log("classToPlain(user)", user);


    return from(this.authService.login(user, response))
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<UserDto | any> {
    return this.authService.findOneByEmail(createUserDto.email).pipe(
      map(foundUser => {
        if (foundUser?.email) {
          throw new ConflictException('Email already exists');
        }

      }),
      catchError(error => {

        console.error('Error occurred:', error.response.statusCode);
        if (error.response.statusCode === 404) {
          return from(this.authService.create(createUserDto))
        }
        if (error.response.statusCode === 409) throw new ConflictException('Email already exists');
        throw new BadRequestException()
      })
    );

  }
}
