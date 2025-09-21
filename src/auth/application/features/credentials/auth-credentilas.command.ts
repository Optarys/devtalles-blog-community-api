import { Command } from "@nestjs/cqrs"

export class AuthCredentialsCommand extends Command<any> {

    constructor(
        public readonly identifier: string, 
        public readonly password: string
    ) {
        super();
    }
}