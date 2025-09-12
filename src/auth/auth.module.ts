import { Module } from '@nestjs/common';
import { DiscordStrategy, GoogleStrategy } from './infrastructure/strategys';
import { OAUTH_STRATEGIES } from './application/constants/oauth.constants';
import { OAuthStrategyService } from './application/services/oauth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { CoreModule } from '@core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth2CommandHandler, RedirectOauth2QueryHandler } from './application/features/oauth2';
import { AuthContext } from './infrastructure/context';
import { OAuth2Strategy } from './application/abstractions/contracts';
import { GitHubStrategy } from './infrastructure/strategys/github.strategy';

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
        RedirectOauth2QueryHandler
    ],
})
export class AuthModule { }
