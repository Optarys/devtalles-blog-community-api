import { LoginWithCredentials } from '@auth/application/features/loginWithCredentials/login-with-credentials';
import { MediatorService } from '@core/common/services';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly mediator: MediatorService) { }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() request: LoginWithCredentials) {

        const result = await this.mediator.execute(request);

        return result.match(
            (value) => value,
            (error, details) => (details)
        );
    }
}
