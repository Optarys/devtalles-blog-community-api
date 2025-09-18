import { ICommandHandler } from "@core/common/handlers";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Logger, UnauthorizedException } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { ExchangeCodeCommand } from "./exchange-code.command";
import { Result } from "@core/common/responses";
import { CommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { AuthContext } from "@auth/infrastructure/context";

@CommandHandler(ExchangeCodeCommand)
export class ExchangeCodeHandler implements ICommandHandler<ExchangeCodeCommand> {
    logger = new Logger(ExchangeCodeHandler.name);

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly context: AuthContext,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Ejecuta el intercambio (frontend -> backend con el code)
     */
    async execute(command: ExchangeCodeCommand): Promise<Result<any>> {
        try {
            const data = await this.consumeCode(command.code);

            if (!data) {
                throw new UnauthorizedException("Exchange code inválido o expirado");
            }

            const user = await this.context.users.findOneBy({
                externalId: data.user
            })

            // 6. Generar JWT interno
            const jwt = await this.jwtService.signAsync({
                sub: user!.externalId,
                username: user!.username,
                role: user!.roles[0].name,
                provider: data.provider,
            });


            return Result.success({
                token: jwt,
                user: {
                    email: user!.email,
                    username: user!.username,
                    roles: user!.roles.map(r => r.name),
                },
            });
        } catch (err) {
            this.logger.error(err);
            return Result.failure("Error en el intercambio", err);
        }
    }

    async consumeCode(code: string) {
        const entry = await this.cacheManager.get<{ userId: string; provider: string; expiresAt: number }>(code);

        if (!entry) return null;

        // Verificar expiración
        if (Date.now() > entry.expiresAt) {
            await this.cacheManager.del(code);
            return null;
        }

        // Eliminar para que sea one-time
        await this.cacheManager.del(code);

        return {
            provider: entry.provider,
            user: entry.userId
        };
    }

}