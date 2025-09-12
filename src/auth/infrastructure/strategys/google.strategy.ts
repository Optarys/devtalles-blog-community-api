import { OAuth2Strategy } from "@auth/application/abstractions/contracts";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends OAuth2Strategy {

    constructor(readonly config: ConfigService) {
        super({
            provider: 'google',
            clientId: config.get<string>('GOOGLE_OAUTH_CLIENT_ID')!,
            clientSecret: config.get<string>('GOOGLE_OAUTH_CLIENT_SECRET')!,
            redirectUri: config.get<string>('GOOGLE_OAUTH_REDIRECT_URI')!
        })

        this.logger = new Logger(GoogleStrategy.name);
    }

    getAuthorizationUrl(state: string): string {
        this.logger.debug('Generando URL de autorización para Google');

        const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const params = new URLSearchParams({
            client_id: this.options.clientId,
            redirect_uri: this.options.redirectUri,
            response_type: 'code',
            scope: [
                'openid',
                'email',
                'profile'
            ].join(' '),
            access_type: 'offline', // para obtener refresh_token
            prompt: 'consent',      // fuerza pantalla de consentimiento
            state,
        });

        const url = `${baseUrl}?${params.toString()}`;
        this.logger.verbose(`Authorization URL generada: ${url}`);

        return url;
    }


    async exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken?: string; }> {

        this.logger.debug(`Iniciando intercambio de code por token con Google...`);
        this.logger.verbose(`Authorization code recibido: ${code}`);

        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: this.options.clientId,
                    client_secret: this.options.clientSecret,
                    redirect_uri: this.options.redirectUri,
                    grant_type: 'authorization_code',
                }),
            });

            this.logger.debug(`Respuesta recibida de Google (status: ${response.status})`);

            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Error al intercambiar code: ${response.status} - ${errorText}`);
                throw new Error(`Google Token Exchange Failed: ${response.status}`);
            }

            const data = await response.json();
            return {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            };
        } catch (error) {
            this.logger.error('Error en exchangeCodeForToken', error);
            throw error;
        }
    }

    async getUserProfile(accessToken: string): Promise<{ id: string; email?: string; name?: string; }> {

        this.logger.debug(`Solicitando perfil de usuario a Google...`);
        this.logger.verbose(`AccessToken (primeros 10 caracteres): ${accessToken.slice(0, 10)}...`);

        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            this.logger.debug(`Respuesta de perfil recibida (status: ${response.status})`);

            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Error al obtener perfil: ${response.status} - ${errorText}`);
                throw new Error(`Google UserInfo Failed: ${response.status}`);
            }

            const data = await response.json();
            this.logger.log(`Perfil obtenido: id=${data.sub}, email=${data.email ?? 'N/A'}, name=${data.name ?? 'N/A'}`);

            return {
                id: data.sub,
                email: data.email,
                name: data.name,
            };
        } catch (error) {
            this.logger.error('Error en getUserProfile', error);
            throw error;
        }
    }

}