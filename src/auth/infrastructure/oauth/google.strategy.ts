import { IOAuthStrategy } from "@auth/application/contracts";
import { Logger } from "@nestjs/common";

export class GoogleStrategy implements IOAuthStrategy {
    readonly logger: Logger = new Logger(GoogleStrategy.name);
    readonly provider: string = 'google';

    getAuthorizationUrl(state: string): string {
        throw new Error("Method not implemented.");
    }
    exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken?: string; }> {
        throw new Error("Method not implemented.");
    }
    getUserProfile(accessToken: string): Promise<{ id: string; email?: string; name?: string; }> {
        throw new Error("Method not implemented.");
    }

}