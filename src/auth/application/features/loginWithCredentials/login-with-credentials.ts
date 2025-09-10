import { LoginWithCredentialsDto } from '@auth/application/dtos/loginWithCredentials.dto';
import { Command } from '@nestjs/cqrs';

export class LoginWithCredentials extends Command<LoginWithCredentialsDto> {

    constructor(public readonly identifier: string, public readonly password: string) {
        super();
    }

}