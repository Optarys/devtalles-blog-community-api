import { Command } from "@nestjs/cqrs";

export class SignupCommand extends Command<any> {

    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly username?: string
    ) {
        super();

    }
}