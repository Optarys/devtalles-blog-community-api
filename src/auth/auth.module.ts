import { Module } from '@nestjs/common';
import { DiscordStrategy, GoogleStrategy, GitHubStrategy } from './infrastructure/strategys';
import { OAUTH_STRATEGIES } from './application/constants/oauth.constants';
import { OAuthStrategyService } from './application/services/oauth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { CoreModule } from '@core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth2CommandHandler, RedirectOauth2QueryHandler } from './application/features/oauth2';
import { AuthContext } from './infrastructure/context';
import { OAuth2Strategy } from './application/contracts';
import { ExchangeCodeHandler } from './application/features/exchange/exchange-code.handler';
import { AuthCredentialsHandler } from './application/features/credentials/auth-credentials.handler';
import { SignupHandler } from './application/features/signup/signup.handler';

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
        GitHubStrategy,
        {
            provide: OAUTH_STRATEGIES,
            useFactory: (...strategies: OAuth2Strategy[]) => strategies,
            inject: [GoogleStrategy, DiscordStrategy, GitHubStrategy],
        },
        OAuthStrategyService,
        OAuth2CommandHandler,
        RedirectOauth2QueryHandler,
        ExchangeCodeHandler,
        AuthCredentialsHandler,
        SignupHandler
    ],
    exports: [JwtModule]
})
export class AuthModule { }
