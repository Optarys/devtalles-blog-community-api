import { Command } from "@nestjs/cqrs";
import { IsIn, IsNotEmpty } from "class-validator";

export class OAuth2Command extends Command<any> {
    @IsNotEmpty()
    @IsIn(['google', 'discord'],)
    readonly provider: string;

    @IsNotEmpty()
    readonly code: string

    constructor(provider: string, code: string) {
        super();
        this.provider = provider;
        this.code = code;
    }
}