import { CustomLoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtGuard } from './guards/jwt.guard';
import { LocalStrategy } from './startegies/startergy';
import { UsersModule } from './users/users.module';
import { JwtStrategy } from './startegies/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SReservation',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3010,
        },
      },
    ]),
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
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy, {
    provide: APP_GUARD,
    useClass: JwtGuard,
  },
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {
}
