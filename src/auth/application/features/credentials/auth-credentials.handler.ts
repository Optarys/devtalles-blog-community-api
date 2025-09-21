import { ICommandHandler } from "@core/common/handlers";
import { AuthCredentialsCommand } from "./auth-credentilas.command";
import { Result } from "@core/common/responses";
import { Logger, Injectable } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { compare } from "bcryptjs";
import { AuthContext } from "@auth/infrastructure/context";
import { JwtService } from "@nestjs/jwt";

@CommandHandler(AuthCredentialsCommand)
@Injectable()
export class AuthCredentialsHandler implements ICommandHandler<AuthCredentialsCommand> {
    logger: Logger = new Logger(AuthCredentialsHandler.name);

    constructor(
        private readonly context: AuthContext,
        private readonly jwtService: JwtService
    ) { }

    async execute(command: AuthCredentialsCommand): Promise<Result<any>> {
        const { identifier, password } = command;

        try {
            // Determinar si es email
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

            // Buscar el usuario según email o username
            const user = await this.context.users.findOne({
                where: isEmail ? { email: identifier } : { username: identifier },
                relations: ['roles', 'credentials'],
            });

            if (!user) {
                return Result.failure('Usuario o contraseña inválidos');
            }

            // Buscar la credencial correcta según tipo
            const credential = user.credentials[0];

            if (!credential) {
                return Result.failure('Usuario o contraseña inválidos');
            }

            // Verificar contraseña
            const isValid = await compare(password, credential.credentialHash);
            if (!isValid) {
                return Result.failure('Usuario o contraseña inválidos');
            }

            // Actualizar last login
            credential.lastLoginAt = new Date();
            await this.context.users.manager.save(credential);


            // Generar JWT interno
            const jwt = await this.jwtService.signAsync({
                sub: user.externalId,
                username: user.username,
                role: user.roles[0].name
            });


            return Result.success({
                token: jwt,
                user: {
                    email: user!.email,
                    username: user!.username,
                    roles: user!.roles.map(r => r.name),
                },
            });

        } catch (error) {
            this.logger.error('Error autenticando usuario', error.stack);
            return Result.failure('Error interno al autenticar');
        }
    }
}