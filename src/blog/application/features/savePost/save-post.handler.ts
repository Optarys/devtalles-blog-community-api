import { ICommandHandler } from "@core/common/handlers";
import { SavePostCommand } from "./save-post.command";
import { Result } from "@core/common/responses";
import { Logger, NotFoundException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { BlogContext } from "@blog/infrastructure/context";
import { PostSavedEntity } from "@core/persistence/models/post_saved.model";

@CommandHandler(SavePostCommand)
export class SavePostHandler implements ICommandHandler<SavePostCommand> {
    logger = new Logger(SavePostHandler.name);

    constructor(private readonly context: BlogContext) { }

    async execute(command: SavePostCommand): Promise<Result<any>> {
        const { userId, postId, postSlug } = command;

        // Buscar el post
        const post = postId
            ? await this.context.posts.findOne({ where: { id: postId } })
            : await this.context.posts.findOne({ where: { slug: postSlug! } });

        if (!post) {
            throw new NotFoundException(`Post ${postId ?? postSlug} no encontrado`);
        }

        // Buscar el usuario
        const user = await this.context.users.findOne({ where: { id: Number(userId) } });
        if (!user) {
            throw new NotFoundException(`Usuario ${userId} no encontrado`);
        }

        // Crear registro de post guardado
        const saved = new PostSavedEntity();
        saved.post = post;
        saved.user = user;

        await this.context.postSaved.save(saved);

        this.logger.log(`Usuario ${userId} guardó el post ${post.id}`);

        return Result.success({
            message: "Post guardado correctamente",
            postId: post.id,
            userId: user.id,
            savedAt: saved.savedAt,
        });
    }
}
