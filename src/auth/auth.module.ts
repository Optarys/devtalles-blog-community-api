import { Module } from '@nestjs/common';
import { DiscordStrategy, GoogleStrategy } from './infrastructure/strategys';
import { OAUTH_STRATEGIES } from './application/constants/oauth.constants';
import { IOAuthStrategy } from './application/abstractions/contracts';
import { OAuthStrategyService } from './application/services/oauth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { CoreModule } from '@core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        CoreModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                global: true,
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<string>('JWT_EXPIRATION_TIME'),
                    algorithm: 'HS256',
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        GoogleStrategy,
        DiscordStrategy,
        {
            provide: OAUTH_STRATEGIES,
            useFactory: (...strategies: IOAuthStrategy[]) => strategies,
            inject: [GoogleStrategy, DiscordStrategy],
        },
        OAuthStrategyService,
    ]
})
export class AuthModule { }
