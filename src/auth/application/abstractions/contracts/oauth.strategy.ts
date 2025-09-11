import { Logger } from "@nestjs/common";

export interface IOAuthStrategy {
    readonly logger: Logger;
    readonly provider: string; // ej. "google", "discord"
    getAuthorizationUrl(state: string): string;
    exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken?: string }>;
    getUserProfile(accessToken: string): Promise<{ id: string; email?: string; name?: string }>;
}