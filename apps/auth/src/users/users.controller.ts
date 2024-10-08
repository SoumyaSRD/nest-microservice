import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Observable, from } from 'rxjs';
import { CreateUserDto, UserDto, UserFilterDto } from './dto/create-user.dto';
import { IuserService } from './user-interface/UserServiceInterfaces/IUserService';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {

  isuerService: IuserService;
  constructor(private readonly userService: UsersService) {
    this.isuerService = userService;
  }
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get()
  findAll(): Observable<UserDto[]> {
    return from(this.userService.findAll());
  }

  @Delete(':id')
  findOneAndDelete(@Param('id') id: string): Observable<UserDto> {
    return from(this.userService.deleteUser(id));
  }

  @Put('/')
  findOneAndUpdate(@Body() user: UserDto): Observable<UserDto> {
    return from(this.userService.updateUser(user));
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
