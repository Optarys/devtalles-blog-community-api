import { Post, Tag } from "@blog/domain/entities";
import { Result } from "@core/common/responses";
import { CreatePostCommand } from "./create-post.command";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import { StorageService } from "@blog/application/services";
import { ICommandHandler } from "@core/common/handlers";
import { Logger } from "@nestjs/common";
import { PostRepository } from "@blog/infrastructure/repositories";
import { QueryFailedError } from "typeorm";

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {

    readonly logger: Logger = new Logger(CreatePostHandler.name);

    constructor(
        private readonly postRepository: PostRepository,
        private readonly eventBus: EventBus,
        private readonly storage: StorageService,
    ) { }

    async execute(command: CreatePostCommand): Promise<Result<any>> {
        const { title, authorId, content, category, tags, seoMeta, banners, summary, status } = command;

        // Subir banners
        const bannerUrls: string[] = [];
        if (banners && banners.length > 0) {
            for (const file of banners) {
                const key = `${Date.now()}-${file.originalname}`; // evitar colisiones
                const { key: uploadedKey } = await this.storage.uploadFile(key, file.buffer, file.mimetype);
                bannerUrls.push(uploadedKey);
            }
        }

        // Crear tags
        const tagEntities: Tag[] = (tags || []).map(name => new Tag(name));

        // Crear agregado
        const post = Post.create(title, content, summary, authorId, category, status)
            .addTags(tagEntities)
            .addSeoMeta(seoMeta);

        bannerUrls.forEach(url => post.addBannerImage(url));

        try {
            // Persistir usando repositorio
            const savedPost = await this.postRepository.save(post);

            // Publicar eventos
            savedPost.pullDomainEvents().forEach(event => this.eventBus.publish(event));

            this.logger.log(`Post creado: ${title} por ${authorId}`);
            return Result.success();
        } catch (error) {
            await Promise.all(
                bannerUrls.map(url => this.storage.deleteFile(url))
            );

            if (error instanceof QueryFailedError) {

                return Result.failure('Error al crear post', {
                    message: error.driverError['detail'],
                    code: error.driverError['code']
                });
            }
            this.logger.error('Error al crear post', error);
            return Result.failure('Error al crear post', error);
        }
    }
}
