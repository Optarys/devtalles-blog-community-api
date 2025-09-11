import { OAuth2Command } from '@auth/application/features/oauth2';
import { MediatorService } from '@core/common/services';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly mediator: MediatorService) { }

    @Get('oauth2/callback')
    @HttpCode(HttpStatus.OK)
    async discordLogin(@Query('code') code: string) {
        const result = await this.mediator.execute(new OAuth2Command('discord', code ));
        return result.match(
            (value) => value,
            (error, details) => details,
        );
    }
}

