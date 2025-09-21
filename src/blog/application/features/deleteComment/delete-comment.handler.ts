import { ICommandHandler } from "@core/common/handlers";
import { DeleteCommentCommand } from "./delete-comment.command";
import { Result } from "@core/common/responses";
import { ForbiddenException, Logger, NotFoundException } from "@nestjs/common";
import { BlogContext } from "@blog/infrastructure/context";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
    logger = new Logger(DeleteCommentCommand.name);

    constructor(private readonly context: BlogContext) { }

    async execute(command: DeleteCommentCommand): Promise<Result<any>> {
        const { authorId, commentId } = command;

        const comment = await this.context.postComments.findOne({
            where: {
                id: commentId
            },
            relations: ['user']
        });

        if (!comment) {
            throw new NotFoundException(
                `Comentario con id ${commentId} no encontrado`,
            );
        }

        if (comment.user.externalId != authorId) {
            throw new ForbiddenException(
                `El Comentario no fue escrito por este usuario`,
            )
        }

        comment.isModerated = true;
        comment.deletedAt = new Date();

        await this.context.postComments.save(comment);

        this.logger.log(`Comentario ${commentId} eliminado por autor ${authorId}`);

        return Result.success({
            message: "Comentario eliminado correctamente",
            commentId,
        });
    }
}