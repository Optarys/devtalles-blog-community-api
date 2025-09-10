import { CommandHandler } from "@nestjs/cqrs";
import { ICommandHandler } from "@core/common/handlers";
import { Result } from "@core/common/responses";
import { LoginWithCredentials } from "./login-with-credentials";
import { AuthContext } from "@auth/infrastructure/context";
import { LoginWithCredentialsDto } from "@auth/application/dtos/loginWithCredentials.dto";
import { InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import ms, { StringValue } from 'ms';
import { ConfigService } from "@nestjs/config";

@CommandHandler(LoginWithCredentials)
export class LoginWithCredentialsHandler implements ICommandHandler<LoginWithCredentials> {

    private readonly logger = new Logger(LoginWithCredentialsHandler.name);

    constructor(
        private readonly context: AuthContext,

        private readonly config: ConfigService
    ) { }

    async execute(command: LoginWithCredentials): Promise<Result<LoginWithCredentialsDto>> {
        const { identifier, password } = command;

        const type = this.isUsernameOrEmail(identifier);

        this.logger.log(`Intentando iniciar sesión para usuario: ${identifier}`);
        try {
            let query = type === 'email' ?
                this.context.users.createQueryBuilder('user').where('user.email = :identifier', { identifier }) :
                this.context.users.createQueryBuilder('user').where('user.username = :identifier', { identifier });

            const user = await query.getOne();

            if (!user) {
                this.logger.warn(`Usuario no encontrado: ${identifier}`);
                throw new NotFoundException('Usuario no encontrado');
            }
            if (!this.verifyPassword(password, user.lastName)) {
                this.logger.warn(`Contraseña inválida para usuario: ${identifier}`);
                throw new NotFoundException('Credenciales inválidas');
            }

            this.logger.log(`Usuario autenticado: ${user.externalId}`);

            return Result.success({
                accessToken: 'await this.generateJwtToken(user)',
                expiresIn: ms(this.config.get<string>('JWT_EXPIRATION_TIME') as StringValue) / 1000
            });

        } catch (error) {
            this.logger.error(`Error en inicio de sesión para usuario: ${identifier}`, error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error interno en el servidor');
        }

    }

    private isUsernameOrEmail(identifier: string): 'username' | 'email' {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(identifier) ? 'email' : 'username';
    }

    private verifyPassword(providedPassword: string, storedPasswordHash: string): boolean {
        // Implementar la lógica de verificación de contraseña (hashing, comparación, etc.)
        return providedPassword === storedPasswordHash; // Ejemplo simplificado
    }
}