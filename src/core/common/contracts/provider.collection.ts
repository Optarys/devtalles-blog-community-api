import { NotImplementedException, Provider } from "@nestjs/common";

export interface ProviderCollection {
    providersCollection(): Provider[];
}