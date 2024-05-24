import { CustomLoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    CustomLoggerModule,
    /*  JwtModule.registerAsync({
       useFactory: (configService: ConfigService) => ({
         secret: configService.get<string>('JWT_SECRET'),
         signOptions: {
           expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
         },
       }),
       imports: undefined
     }), */
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
