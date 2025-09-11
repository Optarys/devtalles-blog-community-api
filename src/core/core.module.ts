import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ORMConfiguration } from './persistence/config/orm.config';
import { MediatorService } from './common/services';
import { AppContext } from './persistence/context/app.context';

@Module({
    imports: [
        CqrsModule.forRoot(),
        ORMConfiguration.register()
    ],
    providers: [MediatorService, AppContext],
    exports: [MediatorService, AppContext],
})
export class CoreModule { }
