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
import { IuserService as IUserService } from './user-interface/UserServiceInterfaces/IUserService';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {

  private readonly iUserService: IUserService;

  constructor(private readonly userService: UsersService) {
    this.iUserService = this.userService;
  }

  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  @Get()
  findAll(): Observable<any> {
    return from(this.iUserService.findAll());
  }

  @Delete(':id')
  findOneAndDelete(@Param('id') id: string): Observable<UserDto> {
    return from(this.iUserService.deleteUser(id));
  }

  @Put('/')
  findOneAndUpdate(@Body() user: UserDto): Observable<UserDto> {
    return from(this.iUserService.updateUser(user));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<UserDto> {
    return from(this.iUserService.findOne(id));
  }

  @Patch('/email')
  findOneByEmail(@Body() { email }: CreateUserDto): Observable<UserDto> {
    return from(this.iUserService.findOneByEmail(email));
  }

  @Patch('/filterUser')
  @ApiBody({
    type: UserFilterDto
  })
  findAllWithFiltersAndPagination(@Body() filter: Partial<UserFilterDto>): Observable<any> {
    const { page, limit } = filter;
    delete filter.page;
    delete filter.limit;
    return from(this.iUserService.findAllWithFiltersAndPagination(filter, page, limit));
  }
}
