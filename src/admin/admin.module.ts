import { CoreModule } from '@core/core.module';
import { Module } from '@nestjs/common';
import { AdminContext } from './infrastructure/context/admin.context';
import { UserService } from './application/services/user.service';
import { UsersResolver } from './presentation/graphql/users.resolver';
import { UsersController } from './presentation/rest/users.controller';
import { CreateUserHandler } from './application/features/createUser/create-user.handler';
import { UpdateUserHandler } from './application/features/updateUser/update-user.handler';
import { DeleteUserHandler } from './application/features/deleteUser/delete-user.handler';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [CoreModule, JwtModule],
    providers: [
        AdminContext,
        UserService,
        UsersResolver,
        CreateUserHandler,
        UpdateUserHandler,
        DeleteUserHandler
    ],
    controllers: [UsersController]
})
export class AdminModule { }
