import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ORMConfiguration } from './persistence/config/orm.config';
import { MediatorService } from './common/services';
import { AppContext } from './persistence/context/app.context';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
    imports: [
        CqrsModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            debug: true,
            csrfPrevention: true,
            autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql')
        }),
        ORMConfiguration.register()
    ],
    providers: [MediatorService, AppContext],
    exports: [MediatorService, AppContext],
})
export class CoreModule { }
