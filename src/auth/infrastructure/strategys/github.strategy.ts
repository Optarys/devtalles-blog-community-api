import { OAuth2Strategy } from "@auth/application/abstractions/contracts";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GitHubStrategy extends OAuth2Strategy {

    constructor(readonly config: ConfigService) {
        super({
            provider: "github",
            clientId: config.get<string>("GITHUB_CLIENT_ID")!,
            clientSecret: config.get<string>("GITHUB_CLIENT_SECRET")!,
            redirectUri: config.get<string>("GITHUB_REDIRECT_URI")!,
        })

        this.logger = new Logger(GitHubStrategy.name);
    }

    getAuthorizationUrl(state: string): string {
        const base = "https://github.com/login/oauth/authorize";
        const params = new URLSearchParams({
            client_id: this.options.clientId,
            redirect_uri: this.options.redirectUri,
            scope: "read:user user:email",
            state,
        });
        return `${base}?${params.toString()}`;
    }

    /** Paso 2: Intercambiar el code por un accessToken */
    async exchangeCodeForToken(
        code: string
    ): Promise<{ accessToken: string; refreshToken?: string }> {
        const url = "https://github.com/login/oauth/access_token";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: this.options.clientId,
                client_secret: this.options.clientSecret,
                code,
                redirect_uri: this.options.redirectUri,
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            this.logger.error(`GitHub token exchange failed: ${text}`);
            throw new Error("Failed to exchange GitHub code for token");
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error_description || "OAuth2 error");
        }

        return {
            accessToken: data.access_token,
        };
    }
    async getUserProfile(
        accessToken: string
    ): Promise<{ id: string; email?: string; name?: string }> {
        // 1. Info básica del usuario
        const userResponse = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userResponse.ok) {
            const text = await userResponse.text();
            this.logger.error(`GitHub profile fetch failed: ${text}`);
            throw new Error("Failed to fetch GitHub profile");
        }

        const user = await userResponse.json();
        const { id, login, name } = user;

        // 2. Email (a veces no viene en /user)
        let email: string | undefined;
        try {
            const emailResponse = await fetch("https://api.github.com/user/emails", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (emailResponse.ok) {
                const emails = await emailResponse.json();
                const primary = emails.find((e: any) => e.primary);
                email = primary?.email ?? emails[0]?.email;
            } else {
                this.logger.warn("Could not fetch GitHub emails");
            }
        } catch (err) {
            this.logger.warn("GitHub email request failed", err);
        }

        return {
            id: String(id),
            email,
            name: name || login,
        };
    }
}