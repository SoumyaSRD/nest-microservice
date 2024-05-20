import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [NestConfigModule.forRoot({
        envFilePath: [`.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`],
        isGlobal: true,
        validationSchema: Joi.object({
            NODE_ENV: Joi.string()
                .valid('development', 'staging', 'production')
                .default('development'),
            MONGODB_URI: Joi.string().required(),
        })
    })],
    providers: [ConfigService],
    exports: [ConfigService]
})
export class ConfigModule { }
