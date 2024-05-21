import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
@Module({
    imports: [LoggerModule.forRoot({
        /*     pinoHttp: {
    
                stream: pino.destination({
                    dest: './logs/logger', // omit for stdout
                    minLength: 4096, // Buffer before writing
                    sync: false, // Asynchronous logging
                    useLevelLabels: true,
                }),
                transport: { target: 'pino-pretty', options: { singleLine: true }, }
            } */
        pinoHttp: {

            transport: {

                target: 'pino/file',
                options: {

                    singleLine: true,
                    colorize: true,
                    destination: './logs/app.log',
                    translateTime: 'SYS:standard',

                },
            },
            customLogLevel: (res, err) => {
                if (res.statusCode >= 400 && res.statusCode < 500) {
                    return 'warn';
                } else if (res.statusCode >= 500 || err) {
                    return 'error';
                }
                return 'info';
            },
            customSuccessMessage: (res) => {
                if (res.statusCode === 200) {
                    return 'Success';
                }
                return 'Request completed';
            },
            customErrorMessage: (err, res) => {
                return `Error with status code: ${res.statusCode}`;
            },
        }
    })]
})
export class CustomLoggerModule { }
