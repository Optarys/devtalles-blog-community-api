import { Inject, Injectable } from "@nestjs/common";
import { IOAuthStrategy } from "../contracts";
import { OAUTH_STRATEGIES } from "../constants/oauth.constants";
import { ModuleRef } from "@nestjs/core";
import { DiscordStrategy } from "@auth/infrastructure/oauth";

@Injectable()
export class OAuthService {

    private strategyMap: Map<string, IOAuthStrategy> = new Map();

    constructor(@Inject(OAUTH_STRATEGIES) strategies: IOAuthStrategy[], private moduleRef: ModuleRef) {
        strategies.forEach((s) => this.strategyMap.set(s.provider, s));
    }


    on() {
        this.moduleRef.get(DiscordStrategy, { strict: false })
    }

    getStrategy(provider: string): IOAuthStrategy {
        const strategy = this.strategyMap.get(provider);
        if (!strategy) throw new Error(`Proveedor ${provider} no suportado.`);
        return strategy;
    }

}