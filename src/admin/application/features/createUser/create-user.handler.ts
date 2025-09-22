import { ICommandHandler } from "@core/common/handlers";
import { CreateUserCommand } from "./create-user.command";
import { Result } from "@core/common/responses";
import { Logger } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { AdminContext } from "src/admin/infrastructure/context/admin.context";
import { hash } from "bcryptjs";
import { UserCredentialEntity } from "@core/persistence/models";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    logger: Logger = new Logger(CreateUserHandler.name);

    constructor(private readonly context: AdminContext) { }

    async execute(command: CreateUserCommand): Promise<Result<any>> {
        const { firstName, lastName, email, username, password, role } = command;

        try {
            // Verificar si ya existe usuario por email o username
            const existingUser = await this.context.users
                .createQueryBuilder('user')
                .where('user.email = :email', { email })
                .orWhere('user.username = :username', { username: username || '' })
                .getOne();

            if (existingUser) {
                return Result.failure('Usuario ya existe');
            }

            // Obtenemos el rol
            const defaultRole = await this.context.roles.findOne({
                where: { name: role }
            });

            // Crear usuario
            const user = this.context.users.create({
                firstName,
                lastName,
                email,
                username: username ?? undefined,
                isActive: true,
                status: { id: 1 },
                roles: defaultRole ? [defaultRole] : []
            });

            const savedUser = await this.context.users.save(user);

            // Crear credencial
            const hashedPassword = await hash(password, 10);

            const credential = this.context.users.manager.create(UserCredentialEntity, {
                user: savedUser,
                credentialHash: hashedPassword
            });

            await this.context.users.manager.save(credential);

            // Retornar info del usuario
            const responseUser = {
                externalId: savedUser.externalId,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                username: savedUser.username,
            };
            return Result.success(responseUser);
        } catch (error) {
            this.logger.error('Error registrando usuario', error.stack);
            return Result.failure('Error interno al registrar usuario');
        }
    }
}