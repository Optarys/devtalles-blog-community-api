import { Command } from "@nestjs/cqrs";

export class AddCommentCommand extends Command<any> {
    constructor(
        public readonly content: string,
        public readonly authorId: string,
        public readonly postSlug?: string,
        public readonly postId?: number
    ) {
        super();
    }
}