import { OAuth2Command, RedirectOauth2Query } from '@auth/application/features/oauth2';
import { MediatorService } from '@core/common/services';
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { type Response } from 'express';
import ms, { StringValue } from 'ms';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly mediator: MediatorService,
    ) { }

    @Get('oauth2/redirect')
    @ApiQuery({ name: 'provider', enum: ['github', 'discord', 'google'] })
    async oauth2Redirect(
        @Query('provider') provider: string,
        @Res({ passthrough: true }) res: Response) {
        const result = await this.mediator.execute(new RedirectOauth2Query(provider));

        return result.matchOrThrow(
            (url) => res.redirect(url),
            HttpStatus.BAD_REQUEST
        );
    }

    @Get('oauth2/callback')
    async oauth2Login(
        @Query('code') code: string,
        @Query('state') state: string,
        @Res({ passthrough: true }) res: Response) {
        const result = await this.mediator.execute(new OAuth2Command(state, code));
        return result.matchOrThrow(
            (value) => {

                const { token, redirect } = value;
                // 1️⃣ Guardar JWT en cookie httpOnly
                res.cookie('jwt', token, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: ms(process.env.COOCKIE_EXPIRTATION_TIME as StringValue)
                });


                console.log(res)

                // 2️⃣ Redirigir al front-end o dashboard
                return res.redirect(redirect);
            },
            HttpStatus.BAD_REQUEST
        );
    }
}

