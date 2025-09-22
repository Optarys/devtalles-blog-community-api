import { Command } from "@nestjs/cqrs";
import { UserRole } from "../../enums/user-role.enum";

export class CreateUserCommand extends Command<any> {

    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly role: UserRole,
        public readonly password: string,
        public readonly username?: string
    ) {
        super();
    }
}