import { Command } from "@nestjs/cqrs";

export class EditPostCommand extends Command<any> {
    
    constructor(
        public readonly postId: string,
        public readonly title?: string,
        public readonly content?: string,
        public readonly summary?: string,
        public readonly category?: string,
        public readonly banners: Express.Multer.File[] = [], // archivos adjuntos
        public readonly tags?: string[],
        public readonly seoMeta?: Record<string, any>
    ) {
        super();
        
    }
}