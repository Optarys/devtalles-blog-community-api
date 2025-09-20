import { ICommandHandler } from "@core/common/handlers";
import { TogglePostCommand } from "./toggle-post.command";
import { Result } from "@core/common/responses";
import { Logger, NotFoundException } from "@nestjs/common";
import { BlogContext } from "@blog/infrastructure/context";
import { parseEnum } from "@core/helpers";
import { PostStatus } from "@core/persistence/models";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(TogglePostCommand)
export class TogglePostHandler implements ICommandHandler<TogglePostCommand> {
    logger = new Logger(TogglePostHandler.name);

    constructor(private readonly context: BlogContext) { }

    async execute(command: TogglePostCommand): Promise<Result<any>> {
        const { postId, postSlug, status } = command;

        // Buscar post por ID o Slug
        const post = postId
            ? await this.context.posts.findOne({
                where: { id: postId },

            })
            : await this.context.posts.findOne({
                where: { slug: postSlug! },
            })


        if (!post) {
            throw new NotFoundException(
                `Post ${postId ?? postSlug} no encontrado`,
            );
        }

        post.status = parseEnum(PostStatus, status, "Estado inválido para el post");

        await this.context.posts.save(post);

        this.logger.log(
            `Post ${post.id} (${post.slug}) cambiado a estado "${status}"`,
        );

        return Result.success({
            message: `Post actualizado correctamente`,
            postId: post.id,
            status: post.status,
        });
    }
}
