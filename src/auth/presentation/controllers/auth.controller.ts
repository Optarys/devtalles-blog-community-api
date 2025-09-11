import { OAuth2Command, RedirectOauth2Query } from '@auth/application/features/oauth2';
import { MediatorService } from '@core/common/services';
import { Controller, Get, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { type Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly mediator: MediatorService,
    ) { }

    @Get('redirect/oauth2')
    async redirectOauth2(
        @Query('provider') provider: string,
        @Res({ passthrough: true }) res: Response) {
        const result = await this.mediator.execute(new RedirectOauth2Query(provider));

        return result.match(
            (value) => res.redirect(value),
            (error, details) => details,
        )
    }


    @Get('oauth2/callback')
    @HttpCode(HttpStatus.OK)
    async oauth2Login(@Query('code') code: string, @Query('state') state: string) {
        const result = await this.mediator.execute(new OAuth2Command(state, code));
        return result.match(
            (value) => value,
            (error, details) => details,
        );
    }
}

