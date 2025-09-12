import * as fs from 'fs';
import { ModuleRegister } from "@core/common/contracts";
import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppDataSource } from './data-source';

const isProd = process.env.NODE_ENV === 'production';
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
            providers: [ORMConfiguration], // <--- aquí
            exports: [ORMConfiguration, TypeOrmModule],
        };
    }
}