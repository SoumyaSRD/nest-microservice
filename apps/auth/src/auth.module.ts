import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { UserDocument, UserScema } from './users/models/user.scema';
import { CustomLoggerModule, DatabaseModule } from '@app/common';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UserRepository } from './users/user.repository';

@Module({
  imports: [UsersModule, DatabaseModule.forFeature([
    {
      name: UserDocument.name,
      schema: UserScema
    }
  ]),
    CustomLoggerModule
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, UserRepository],
})
export class AuthModule { }
