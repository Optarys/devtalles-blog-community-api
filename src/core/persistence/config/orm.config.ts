import * as fs from 'fs';
import { ModuleRegister } from "@core/common/contracts";
import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from "@nestjs/config";

const isProd = process.env.NODE_ENV === 'production';
/**
  * Clase se utiliza la configurar la conexion de la base de datos con el ORM.
*/
export class ORMConfiguration extends ModuleRegister {
    static override register(): DynamicModule {
        console.log(isProd)
        return {
            module: ORMConfiguration,
            imports: [
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => ({
                        type: "postgres",
                        schema: 'public',
                        host: config.get<string>("DB_HOST"),
                        port: config.get<number>("DB_PORT"),
                        username: config.get<string>("DB_USER"),
                        password: config.get<string>("DB_PASS"),
                        database: config.get<string>("DB_NAME"),
                        logging: true,
                        ssl: {
                            ca: isProd 
                            ? fs.readFileSync('/etc/secrets/prod-ca-2021.crt').toString() // Secretos dentro de Render
                            : config.get<string>('DB_CERT') 
                        },                   
                        entities: [__dirname + '/../models/*.model{.ts,.js}'], // 👈 EF-style discovery
                    }),
                }),
            ],
            providers: [ORMConfiguration], // <--- aquí
            exports: [ORMConfiguration, TypeOrmModule],
        };
    }
}