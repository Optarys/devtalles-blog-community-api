import { ICommandHandler } from "@core/common/handlers";
import { AddCommentCommand } from "./add-comment.command";
import { Result } from "@core/common/responses";
import { Logger, NotFoundException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { BlogContext } from "@blog/infrastructure/context";
import { CommentEntity } from "@core/persistence/models";

@CommandHandler(AddCommentCommand)
export class AddCommentHandler implements ICommandHandler<AddCommentCommand> {

    logger = new Logger(AddCommentHandler.name);

    constructor(private readonly context: BlogContext) { }

    async execute(command: AddCommentCommand): Promise<Result<any>> {
        const { authorId, content, idPost, slugPost } = command;

        try {
            // 1️⃣ Buscar el post por id o slug
            const post = idPost
                ? await this.context.posts.findOne({
                    where: { id: Number.parseInt(idPost) },
                    relations: ["author", "category", "tags", "comments"],
                })
                : await this.context.posts.findOne({
                    where: { slug: slugPost! },
                    relations: ["author", "category", "tags", "comments"],
                });

            if (!post) {
                throw new NotFoundException(
                    `Post not found (id: ${idPost}, slug: ${slugPost})`,
                );
            }

            // 2️⃣ Buscar el autor
            const user = await this.context.users.findOneBy({ externalId: authorId });
            if (!user) {
                throw new NotFoundException(`User with externalId ${authorId} not found`);
            }

            // 3️⃣ Crear el comentario
            const comment = new CommentEntity();
            comment.authorName = user.username;
            comment.authorEmail = user.email ?? user.externalId;
            comment.content = content;
            comment.user = user;
            comment.post = post;
            comment.createdAt = new Date();

            // 4️⃣ Guardar en la BD
            const saved = await this.context.comments.save(comment);

            this.logger.log(
                `✅ Comment ${saved.id} added to Post ${post.id} by user ${authorId}`,
            );
            return Result.success(saved);
        } catch (err) {
            this.logger.error("❌ Error adding comment", err.stack);
            return Result.failure(err.message ?? "Unexpected error adding comment");
        }
    }
}
