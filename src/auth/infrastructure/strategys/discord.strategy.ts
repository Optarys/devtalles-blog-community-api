import { IOAuthStrategy } from "@auth/application/abstractions/contracts";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DiscordStrategy implements IOAuthStrategy {
    readonly logger: Logger = new Logger(DiscordStrategy.name);

    readonly provider: string = 'discord';

    constructor(private readonly config: ConfigService) { }

    getAuthorizationUrl(state: string): string {
        this.logger.log('Creando URL de redireccionamiento')

        const clientId = this.config.get<string>('DISCORD_CLIENT_ID');
        const redirectUri = encodeURIComponent(this.config.get<string>('DISCORD_REDIRECT_URI')!);
        const scope = encodeURIComponent('identify email');

        return `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    }

    async exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken?: string; }> {
        const clientId = this.config.get<string>('DISCORD_CLIENT_ID')!;
        const clientSecret = this.config.get<string>('DISCORD_CLIENT_SECRET')!;
        const redirectUri = this.config.get<string>('DISCORD_REDIRECT_URI')!;

        this.logger.log({
            clientId,
            redirectUri,
            code,
        });


        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);

        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const res = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
             },
            body: params.toString(),
        });

        console.log(params.toString())

        if (!res.ok) {
            const errorText = await res.text();
            this.logger.error(`Error intercambiando code: ${JSON.stringify(errorText)}`);
            throw new Error(`Discord token exchange failed: ${res.status}`);
        }

        const data = await res.json();
        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        };
    }

    async getUserProfile(accessToken: string): Promise<{ id: string; email?: string; name?: string; }> {
        const res = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            this.logger.error(`Error obteniendo perfil: ${errorText}`);
            throw new Error(`Discord profile fetch failed: ${res.status}`);
        }

        const profile = await res.json();

        return {
            id: profile.id,
            email: profile.email,
            name: profile.username,
        };
    }

}