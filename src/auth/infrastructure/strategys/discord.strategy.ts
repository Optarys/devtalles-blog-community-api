import { OAuth2Strategy } from "@auth/application/abstractions/contracts";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DiscordStrategy extends OAuth2Strategy {

    constructor(readonly config: ConfigService) {
        super({
            provider: "discord",
            clientId: config.get<string>('DISCORD_CLIENT_ID')!,
            clientSecret: config.get<string>('DISCORD_CLIENT_SECRET')!,
            redirectUri: config.get<string>('DISCORD_REDIRECT_URI')!,
        })

        this.logger = new Logger(DiscordStrategy.name);
    }

    getAuthorizationUrl(state: string): string {
        this.logger.log('Creando URL de redireccionamiento')

        const redirectUri = encodeURIComponent(this.options.redirectUri);
        const scope = encodeURIComponent('identify email');

        return `https://discord.com/oauth2/authorize?client_id=${this.options.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    }

    async exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken?: string; }> {

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', this.options.redirectUri);

        const basicAuth = Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString('base64');

        const res = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
            },
            body: params.toString(),
        });

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