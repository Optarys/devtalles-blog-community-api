import { ExchangeCodeCommand } from '@auth/application/features/exchange/exchange-code.command';
import { OAuth2Command, RedirectOauth2Query } from '@auth/application/features/oauth2';
import { ConfigurationsService, MediatorService } from '@core/common/services';
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly mediator: MediatorService,
        private readonly config: ConfigurationsService
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
            (value) => res.redirect(value.redirect),
            HttpStatus.BAD_REQUEST
        );
    }

    @Get('oauth2/exchange')
    async oauth2Exchange(
        @Query('code') code: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.mediator.execute(new ExchangeCodeCommand(code));

        // Espera que el matchOrThrow termine antes de continuar
        const value = await result.matchOrThrow(
            (v) => v,
            HttpStatus.BAD_REQUEST
        );

        const { token, user } = value;

        // Guardar JWT en cookie HttpOnly cross-site
        const cookieOptions = await this.config.getCookie();
        res.cookie('jwt', token, cookieOptions);

        // Retornar info mínima del usuario
        return res.status(HttpStatus.OK).json({
            message: 'Sesión iniciada',
            user,
        });
    }
}

