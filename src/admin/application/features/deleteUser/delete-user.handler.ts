import { ICommandHandler } from "@core/common/handlers";
import { DeleteUserCommand } from "./delete-user.command";
import { CommandHandler } from "@nestjs/cqrs";
import { Result } from "@core/common/responses";
import { Logger } from "@nestjs/common";
import { AdminContext } from "src/admin/infrastructure/context/admin.context";
import { StorageService } from "@core/common/services";
import { UserStatusEntity } from "@core/persistence/models";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    logger = new Logger(DeleteUserHandler.name);

    constructor(
        private readonly context: AdminContext,
        private readonly storage: StorageService
    ) { }

    async execute(command: DeleteUserCommand): Promise<Result<any>> {
        const { externalId } = command;

        try {
            const user = await this.context.users.findOne({
                where: { externalId }
            });

            if (!user) return Result.failure(`Usuario ${externalId} no encontrado`);

            // Eliminar avatar si existe
            if (user.avatarUrl) {
                try {
                    await this.storage.deleteFile(user.avatarUrl);
                } catch (err) {
                    this.logger.warn(`No se pudo eliminar avatar del usuario: ${err.message}`);
                }
            }

            //  Soft delete
            user.isActive = false;
            user.deletedAt = new Date();
            user.status = { id: 4 } as UserStatusEntity
            const deletedUser = await this.context.users.save(user);

            return Result.success({
                externalId: deletedUser.externalId,
                deletedAt: deletedUser.deletedAt
            });
        } catch (error) {
            this.logger.error(error);
            return Result.failure('Error eliminando el usuario');
        }
    }
}