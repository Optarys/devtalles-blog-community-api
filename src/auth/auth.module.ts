import { Module } from '@nestjs/common';
import { DiscordStrategy, GoogleStrategy } from './infrastructure/oauth';
import { OAUTH_STRATEGIES } from './application/constants/oauth.constants';
import { IOAuthStrategy } from './application/contracts';
import { OAuthService } from './application/services/oauth.service';
import { AuthController } from './presentation/controllers/auth/auth.controller';
import { CoreModule } from '@core/core.module';

@Module({
    imports: [
        CoreModule
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
        OAuthService,
    ]
})
export class AuthModule { }
