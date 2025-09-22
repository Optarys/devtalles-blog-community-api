import { CommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "./update-user.command";
import { ICommandHandler } from "@core/common/handlers";
import { Result } from "@core/common/responses";
import { Logger } from "@nestjs/common";
import { AdminContext } from "src/admin/infrastructure/context/admin.context";
import { hash } from "bcryptjs";
import { StorageService } from "@core/common/services";
import { UserRole } from "../../enums/user-role.enum";
import { UserCredentialEntity } from "@core/persistence/models";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    logger: Logger = new Logger(UpdateUserHandler.name);

    constructor(
        private readonly context: AdminContext,
        private readonly storage: StorageService
    ) { }

    async execute(command: UpdateUserCommand): Promise<Result<any>> {
        try {
            const { externalId, firstName, lastName, username, email, password, role, avatar, bio } = command;

            // Buscar el usuario
            const user = await this.context.users.findOne({
                where: { externalId },
                relations: ['credentials', 'roles']
            });
            if (!user) return Result.failure(`Usuario ${externalId} no encontrado`);

            // Actualizar campos simples
            if (firstName?.trim()) user.firstName = firstName;
            if (lastName?.trim()) user.lastName = lastName;
            if (username?.trim()) user.username = username;
            if (email?.trim()) user.email = email;
            if (bio?.trim()) user.bio = bio;

            // Actualizar contraseña
            if (password) {
                const hashed = await hash(password, 10);
                if (!user.credentials || user.credentials.length === 0) {
                    user.credentials = [];

                    const credential = new UserCredentialEntity();
                    credential.credentialHash = hashed;
                    credential.user = user;
                    credential.createdAt = new Date();
                    user.credentials.push(credential);

                } else {
                    user.credentials[0].credentialHash = hashed;
                }
            }


            // Actualizar roles (un solo role por simplicidad)
            if (role && role != UserRole.NOACTION) {
                const foundRole = await this.context.roles.findOneBy({ name: role });
                if (!foundRole) return Result.failure(`Role ${role} not found`);
                user.roles = [foundRole];
            }

            // Subir avatar si existe
            if (avatar) {
                // 🔹 Eliminar avatar anterior si existe
                if (user.avatarUrl) {
                    try {
                        await this.storage.deleteFile(user.avatarUrl);
                    } catch (err) {
                        this.logger.warn(`No se pudo eliminar avatar anterior: ${err.message}`);
                    }
                }
                // 🔹 Subir nuevo avatar
                const key = `avatars/${Date.now()}-${user.externalId}`;
                const { key: uploadedKey } = await this.storage.uploadFile(key, avatar.buffer, avatar.mimetype);
                user.avatarUrl = uploadedKey;
            }

            // Guardar cambios
            const updated = await this.context.users.save(user);

            const responseUser = {
                externalId: updated.externalId,
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                username: updated.username,
                avatar: encodeURI(`${"https://fexkbggtblbjuixkpbzi.supabase.co/storage/v1/object/public/devtalles-blog-storage"}/${updated.avatarUrl}`)
            };
            return Result.success(responseUser);
        } catch (error) {
            this.logger.error(error);
            return Result.failure('Error actualizando el usuario');
        }
    }
}