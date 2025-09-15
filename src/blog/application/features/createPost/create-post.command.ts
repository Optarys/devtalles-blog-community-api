import { Command } from "@nestjs/cqrs";

export class CreatePostCommand extends Command<any> {
    constructor(
        public readonly title: string,
        public readonly content: string,
        public readonly summary: string,
        public readonly authorId: string,
        public readonly category: string,
        public readonly status?: string,
        public readonly banners: Express.Multer.File[] = [], // archivos adjuntos
        public readonly tags?: string[],
        public readonly seoMeta?: Record<string, any>
    ) {
        super();
    }
}
