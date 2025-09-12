import { Query } from "@nestjs/cqrs";
import { IsIn, IsNotEmpty } from "class-validator";

export class RedirectOauth2Query extends Query<string> {

    @IsNotEmpty()
    @IsIn(['discord', 'google', 'github'])
    readonly provider: string;

    constructor(provider: string) {
        super();
        this.provider = provider; // asignar al readonly
    }
}