import { Command } from "@nestjs/cqrs";
import { UserRole } from "../../enums/user-role.enum";

export class UpdateUserCommand extends Command<any> {

    constructor(
        public readonly externalId: string,
        public readonly firstName?: string,
        public readonly lastName?: string,
        public readonly email?: string,
        public readonly username?: string,
        public readonly password?: string,
        public readonly role?: UserRole,
        public readonly bio?: string,
        public readonly avatar?: Express.Multer.File
    ) {
        super();

    }
}