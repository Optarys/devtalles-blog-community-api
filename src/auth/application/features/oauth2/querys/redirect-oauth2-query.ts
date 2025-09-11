import { Query } from "@nestjs/cqrs";

export class RedirectOauth2Query extends Query<string> {
    constructor(public readonly provider: string) {
        super();
    }
}