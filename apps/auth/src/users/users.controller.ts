import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Observable, catchError, from, map } from 'rxjs';
import { CreateUserDto, FilterResponseDto, UserDto, UserFilterDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<UserDto | any> {
    return this.userService.findOneByEmail(createUserDto.email).pipe(
      map(foundUser => {
        if (foundUser?.email) {
          throw new ConflictException('Email already exists');
        }

      }),
      catchError(error => {

        console.error('Error occurred:', error.response.statusCode);
        if (error.response.statusCode === 404) {
          return from(this.userService.create(createUserDto))
        }
        if (error.response.statusCode === 409) throw new ConflictException('Email already exists');
        throw new BadRequestException()
      })
    );

  }



  @Get()
  findAll(): Observable<UserDto[]> {
    return from(this.userService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<UserDto> {
    return from(this.userService.findOne(id));
  }

  @Patch('/email')
  findOneByEmail(@Body() { email }: CreateUserDto): Observable<UserDto> {
    return from(this.userService.findOneByEmail(email));
  }

  @Patch('/filterUser')
  @ApiBody({
    type: UserFilterDto
  })
  findAllWithFiltersAndPagination(@Body() filter: Partial<UserFilterDto>): Observable<any> {
    let { page, limit } = filter;
    delete filter.page;
    delete filter.limit;
    return from(this.userService.findAllWithFiltersAndPagination(filter, page, limit));
  }
}
