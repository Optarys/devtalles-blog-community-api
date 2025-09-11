import { Module } from '@nestjs/common';
import { DiscordStrategy, GoogleStrategy } from './infrastructure/strategys';
import { OAUTH_STRATEGIES } from './application/constants/oauth.constants';
import { IOAuthStrategy } from './application/abstractions/contracts';
import { OAuthStrategyService } from './application/services/oauth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { CoreModule } from '@core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth2CommandHandler, RedirectOauth2QueryHandler } from './application/features/oauth2';
import { AuthContext } from './infrastructure/context';

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
        AuthContext,
        GoogleStrategy,
        DiscordStrategy,
        
        {
            provide: OAUTH_STRATEGIES,
            useFactory: (...strategies: IOAuthStrategy[]) => strategies,
            inject: [GoogleStrategy, DiscordStrategy],
        },
        OAuthStrategyService,
        OAuth2CommandHandler,
        RedirectOauth2QueryHandler
    ],
})
export class AuthModule { }
