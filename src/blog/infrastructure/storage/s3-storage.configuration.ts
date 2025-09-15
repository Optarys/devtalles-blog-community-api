import { ModuleRegister } from "@core/common/contracts";
import { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Module } from 'nestjs-s3';

export class S3StorageConfiguration extends ModuleRegister {
    static override register(): DynamicModule {
        return {
            module: S3StorageConfiguration,
            imports: [
                S3Module.forRootAsync({
                    imports: [ConfigModule], // ConfigModule es el que provee ConfigService
                    inject: [ConfigService],
                    useFactory: (env: ConfigService) => ({
                        config: {
                            credentials: {
                                accessKeyId: env.get<string>("AWS_S3_ACCESS_KEY_ID")!,
                                secretAccessKey: env.get<string>("AWS_S3_SECRET_ACCESS_KEY")!,
                            },
                            region: env.get<string>("AWS_S3_REGION"),
                            endpoint: env.get<string>("AWS_S3_ENDPOINT"), // opcional
                            forcePathStyle: true,
                            sslEnabled: false,  // 👈
                        },
                    }),
                }),
            ],
            providers: [S3StorageConfiguration]
        };
    }
} 