import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '@app/common';
import { UserDocument, UserScema } from './models/user.scema';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([
    {
      name: UserDocument.name,
      schema: UserScema
    }
  ]),],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository, UsersService]
})
export class UsersModule { }
