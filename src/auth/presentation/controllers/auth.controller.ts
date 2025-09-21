import { AuthCredentialsCommand, AuthCredentialsDto } from '@auth/application/features/credentials';
import { ExchangeCodeCommand } from '@auth/application/features/exchange/exchange-code.command';
import { OAuth2Command, RedirectOauth2Query } from '@auth/application/features/oauth2';
import { SignupCommand, SignupDto } from '@auth/application/features/signup';
import { ConfigurationsService, MediatorService } from '@core/common/services';
import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly mediator: MediatorService,
        private readonly config: ConfigurationsService
    ) { }

    @Post('signup')
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 200, description: 'Usuario registrado correctamente', type: Object })
    @ApiResponse({ status: 400, description: 'Error de validación o usuario existente' })
    async signup(@Body() dto: SignupDto) {
        const command = new SignupCommand(
            dto.firstName,
            dto.lastName,
            dto.email,
            dto.password,
            dto.username
        );

        return this.mediator.execute(command);
    }
    @Post('login')
    @ApiOperation({ summary: 'Login de usuario con username o email' })
    @ApiResponse({ status: 200, description: 'Usuario autenticado correctamente' })
    @ApiResponse({ status: 401, description: 'Usuario o contraseña inválidos' })
    async login(
        @Body() dto: AuthCredentialsDto,
        @Res({ passthrough: true }) res: Response) {
        const result = await this.mediator.execute(new AuthCredentialsCommand(dto.identifier, dto.password))

        const value = result.matchOrThrow(
            (v) => v,
            HttpStatus.BAD_REQUEST
        );

        const { token, user } = value;

        // Guardar JWT en cookie HttpOnly cross-site
        const cookieOptions = await this.config.getCookie();
        res.cookie('jwt', token, cookieOptions);

        return result.getValue()
    }

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
        //return {
        //  message: 'Sesión iniciada',
        //user,
        //};
    }
}

