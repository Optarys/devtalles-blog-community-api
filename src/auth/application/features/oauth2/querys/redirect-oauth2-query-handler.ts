import { QueryHandler } from "@nestjs/cqrs";
import { RedirectOauth2Query } from "./redirect-oauth2-query";
import { OAuthStrategyService } from "@auth/application/services/oauth.service";
import { Result } from "@core/common/responses";
import { IQueryHandler } from "@core/common/handlers";

@QueryHandler(RedirectOauth2Query)
export class RedirectOauth2QueryHandler implements IQueryHandler<RedirectOauth2Query> {
    
    constructor(
        private readonly strategyService: OAuthStrategyService,
    ) { }
    
    async execute(query: RedirectOauth2Query): Promise<Result<string>> {
        const strategy = this.strategyService.getStrategy(query.provider);
        const result = strategy.getAuthorizationUrl(query.provider);
        return Result.success(result)
    }



}