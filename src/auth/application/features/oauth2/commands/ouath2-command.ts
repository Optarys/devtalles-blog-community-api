import { Command } from "@nestjs/cqrs";

export class OAuth2Command extends Command<any> {
    constructor(public readonly provider: string, public readonly code: string){
        super()
    }
}