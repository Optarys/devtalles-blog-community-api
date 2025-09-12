import { CommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { ICommandHandler } from "@core/common/handlers";
import { OAuth2Command } from "./ouath2-command";
import { Result } from "@core/common/responses";
import { AuthContext } from "@auth/infrastructure/context";
import { OAuthStrategyService } from "@auth/application/services";
import { JwtService } from '@nestjs/jwt'
import { OAuthProvider, UserStatus } from "@core/persistence/models";

@CommandHandler(OAuth2Command)
export class OAuth2CommandHandler implements ICommandHandler<OAuth2Command> {
  readonly logger: Logger = new Logger(OAuth2CommandHandler.name);

  constructor(
    private readonly context: AuthContext,
    private readonly strategyService: OAuthStrategyService,
    private readonly jwtService: JwtService,
  ) { }

  async execute(command: OAuth2Command): Promise<Result<any>> {
    try {
      // 1. Obtener la estrategia correspondiente
      const strategy = this.strategyService.getStrategy(command.provider);

      // 2. Intercambiar el code por un accessToken
      const { accessToken } = await strategy.exchangeCodeForToken(command.code);

      // 3. Obtener el perfil del usuario del provider
      const profile = await strategy.getUserProfile(accessToken);
      // profile debería contener { id, email, name, ... }

      // 4. Verificar si ya existe la identidad vinculada a ese provider
      const identity = await this.context.userIdentities.findOne({
        where: {
          provider: command.provider as OAuthProvider,
          providerUserId: profile.id,
        },
        relations: ['user'],
      });

      let user = identity?.user;

      // APLICA FEDERACION DE IDENTIDADES
      // 🔹 Si no existe identidad, pero sí hay un usuario con el mismo email
      if (!user && profile.email) {
        
        user = await this.context.users.findOne({ where: { email: profile.email } }) ?? undefined;

        if (user) {
          // Vinculamos la nueva identidad a la cuenta existente
          const newIdentity = this.context.userIdentities.create({
            provider: command.provider as OAuthProvider,
            providerUserId: profile.id,
            providerUserData: profile,
            user,
          });
          await this.context.userIdentities.save(newIdentity);
        }
      }
      //

      // 5. Si no existe, crear el usuario y la identidad
      if (!user) {
        const [firstName, ...lastParts] = (profile.name ?? "").split(" ");
        const lastName = lastParts.join(" ");

        user = this.context.users.create({
          email: profile.email,
          firstName,
          lastName,
          username: profile.name ?? profile.email?.split('@')[0] ?? profile.id,
          isActive: true,
          status: { id: 2 } as UserStatus,
        });

        await this.context.users.save(user);

        const newIdentity = this.context.userIdentities.create({
          provider: command.provider as OAuthProvider,
          providerUserId: profile.id,
          providerUserData: profile, // puedes guardar json con info extra
          user,
        });
        await this.context.userIdentities.save(newIdentity);
      }

      // 6. Generar JWT interno
      const jwt = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        provider: command.provider,
      });

      return Result.success({
        user,
        token: jwt,
      });
    } catch (err) {
      this.logger.error(err);
      return Result.failure('Error en OAuth2 login', err);
    }
  }
}