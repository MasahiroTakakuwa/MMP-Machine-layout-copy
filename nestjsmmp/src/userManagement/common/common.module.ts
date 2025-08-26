import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule], // Import the ConfigModule
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('SECRETSJWT'), // Retrieve SECRETSJWT from .env
                signOptions: { expiresIn: '30m' },
            }),
            inject: [ConfigService], // Inject ConfigService
        }),
    ],
    exports: [
        JwtModule
    ]
})
export class CommonModule {}
