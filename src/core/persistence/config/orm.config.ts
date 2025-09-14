import { ModuleRegister } from "@core/common/contracts";
import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './data-source';

/**
  * Clase se utiliza la configurar la conexion de la base de datos con el ORM.
*/
export class ORMConfiguration extends ModuleRegister {
    static override register(): DynamicModule {
        return {
            module: ORMConfiguration,
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => (AppDataSource.options),
                }),
            ],
            providers: [ORMConfiguration]
        };
    }
}