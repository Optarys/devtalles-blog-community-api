import { ICommandHandler } from "@core/common/handlers";
import { AddCommentCommand } from "./add-comment.command";
import { Result } from "@core/common/responses";
import { Logger, NotFoundException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { BlogContext } from "@blog/infrastructure/context";
import { PostCommentEntity } from "@core/persistence/models";

@CommandHandler(AddCommentCommand)
export class AddCommentHandler implements ICommandHandler<AddCommentCommand> {

    logger = new Logger(AddCommentHandler.name);

    constructor(private readonly context: BlogContext) { }

    async execute(command: AddCommentCommand): Promise<Result<any>> {
        const { authorId, content, postId: idPost } = command;

        try {
            // Buscar el post por id o slug
            const post =
                await this.context.posts.findOne({
                    where: { id: idPost },
                    relations: ["author", "category", "tags", "comments"],
                })

            if (!post) {
                throw new NotFoundException(
                    `Post not found (id: ${idPost})`,
                );
            }

            // 2️⃣ Buscar el autor
            const user = await this.context.users.findOneBy({ externalId: authorId });
            if (!user) {
                throw new NotFoundException(`User with externalId ${authorId} not found`);
            }

            // 3️⃣ Crear el comentario
            const comment = new PostCommentEntity();
            comment.content = content;
            comment.user = user;
            comment.post = post;
            comment.createdAt = new Date();

            // 4️⃣ Guardar en la BD
            await this.context.postComments.save(comment);

            this.logger.log(
                `✅ Comment  added to Post ${post.id} by user ${authorId}`,
            );
            return Result.success();
        } catch (err) {
            console.log(err)
            this.logger.error("❌ Error adding comment", err.stack);
            return Result.failure(err.message ?? "Unexpected error adding comment");
        }
    }
}
