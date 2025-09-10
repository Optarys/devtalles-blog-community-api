import { DynamicModule, ForwardReference, Provider, Type } from "@nestjs/common";
import { ORMConfiguration } from "./persistence/config/orm.config";
import { ModuleCollection } from "./common/contracts";
import { ProviderCollection } from "./common/contracts/provider.collection";
import { MediatorService } from "./common/services";
import { CqrsModule } from "@nestjs/cqrs";

export class CoreDependencies {

    static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
        return [
           
        ]
    }

    static providersCollection(): Provider[] {
        return [
            MediatorService
        ]
    }
}