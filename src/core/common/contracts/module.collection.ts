import { DynamicModule, ForwardReference, NotImplementedException, Type } from "@nestjs/common";

export abstract class ModuleCollection {
    static modulesCollection(): (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] {
        throw new NotImplementedException();
    }
}