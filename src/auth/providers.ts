import { Provider } from "@nestjs/common"
import { OAuthService } from "./application/services/oauth.service"
import { DiscordStrategy, GoogleStrategy } from "./infrastructure/oauth"
import { OAUTH_STRATEGIES } from "./application/constants/oauth.constants"
import { IOAuthStrategy } from "./application/contracts"

export function authProviders(): Provider[] {
    return [
        GoogleStrategy,
        DiscordStrategy,
        {
            provide: OAUTH_STRATEGIES,
            useFactory: (...strategies: IOAuthStrategy[]) => strategies,
            inject: [GoogleStrategy, DiscordStrategy],
        },
        OAuthService,
    ]
}