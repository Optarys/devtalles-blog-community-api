import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ORMConfiguration } from './persistence/config/orm.config';
import { MediatorService } from './common/services';

@Module({
    imports: [
        CqrsModule.forRoot(),
        ORMConfiguration.register()
    ],
    providers: [MediatorService],
    exports: [MediatorService],
})
export class CoreModule { }
