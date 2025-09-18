import { Command } from "@nestjs/cqrs";

export class SavePostCommand extends Command<any> {
    constructor(
        public readonly userId: string,
        public readonly postId?: string,
        public readonly postSlug?: string) {
        super();
    }
}