import { Inject, Injectable } from "@nestjs/common";
import { IOAuthStrategy } from "../abstractions/contracts";
import { OAUTH_STRATEGIES } from "../constants/oauth.constants";

@Injectable()
export class OAuthStrategyService {

    private strategyMap: Map<string, IOAuthStrategy> = new Map();

    constructor(@Inject(OAUTH_STRATEGIES) strategies: IOAuthStrategy[]) {
        strategies.forEach((s) => this.strategyMap.set(s.provider, s));
    }

    getStrategy(provider: string): IOAuthStrategy {
        const strategy = this.strategyMap.get(provider);
        if (!strategy) throw new Error(`Proveedor ${provider} no suportado.`);
        return strategy;
    }

}