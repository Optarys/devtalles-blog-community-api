import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ORMConfiguration } from './persistence/config/orm.config';
import { MediatorService } from './common/services';
import { AppContext } from './persistence/context/app.context';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigurationsService } from './common/services/configurations.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        CqrsModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            debug: true,
            csrfPrevention: true,
            autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql')
        }),
        CacheModule.register(),
        ORMConfiguration.register()
    ],
    providers: [MediatorService, AppContext, ConfigurationsService],
    exports: [MediatorService, AppContext, ConfigurationsService, CacheModule],
})
export class CoreModule { }
