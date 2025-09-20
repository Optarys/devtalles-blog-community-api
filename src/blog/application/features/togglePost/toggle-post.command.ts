import { Command } from "@nestjs/cqrs";

export class TogglePostCommand extends Command<any> {

    constructor(
        public readonly postId?: number,
        public readonly postSlug?: string,
        public readonly status: 'draft' | 'published' | 'archived' = 'draft'
    ) {
        super();
    }
}

