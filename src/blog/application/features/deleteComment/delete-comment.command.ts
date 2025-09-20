import { Command } from "@nestjs/cqrs";

export class DeleteCommentCommand extends Command<any> {

    constructor(
        public readonly authorId: string,
        public readonly commentId: number) {
        super();
    }
}