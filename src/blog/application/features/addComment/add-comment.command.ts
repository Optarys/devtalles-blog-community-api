import { Command } from "@nestjs/cqrs";

export class AddCommentCommand extends Command<any> {
    constructor(
        public readonly content: string,
        public readonly authorId: string,
        public readonly slugPost?: string,
        public readonly idPost?: string
    ) {
        super();
    }
}