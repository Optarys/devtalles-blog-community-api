import { BadRequestException, Inject, Injectable, NotFoundException, NotImplementedException } from "@nestjs/common";
import { OAuth2Strategy } from "../abstractions/contracts";
import { OAUTH_STRATEGIES } from "../constants/oauth.constants";

@Injectable()
export class OAuthStrategyService {

    private strategyMap: Map<string, OAuth2Strategy> = new Map();

    constructor(@Inject(OAUTH_STRATEGIES) strategies: OAuth2Strategy[]) {
        strategies.forEach((s) => this.strategyMap.set(s.provider, s));
    }

    getStrategy(provider: string): OAuth2Strategy {
        const strategy = this.strategyMap.get(provider);
        if (!strategy) throw new NotFoundException(`Proveedor ${provider} no suportado.`);
        return strategy;
    }

}