import { Command } from "@nestjs/cqrs";

export class DeleteUserCommand extends Command<any>{
    
    constructor(public readonly externalId: string) {
        super();
    }
}