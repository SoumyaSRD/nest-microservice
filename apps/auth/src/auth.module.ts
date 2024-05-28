import { CustomLoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { CustomStrategy } from './startegies/startergy';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [

    CustomLoggerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],

    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomStrategy],
})
export class AuthModule {
  /*   constructor(private configService: ConfigService) {
      console.log(this.configService.get('JWT_SECRET'));
  
    } */
}
