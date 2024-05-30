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
import { IuserService } from './user-interface/UserServiceInterfaces/IUserService';
import { DUser } from '../decorators/user.decorator';
import { Public } from '../decorators/public.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {

  isuerService: IuserService;
  constructor(private readonly userService: UsersService) {
    this.isuerService = userService;
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
