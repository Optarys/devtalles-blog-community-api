import { AppContext } from '@core/persistence/context/app.context';
import { ConfigurationType } from '@core/persistence/models';
import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';

@Injectable()
export class ConfigurationsService {
    constructor(private readonly context: AppContext) { }

    async getCookie(): Promise<CookieOptions> {
        const configuration = await this.context.configuration.findOneBy({
            configType: ConfigurationType.GENERAL,
            id: 2 // Ojo: este ID debería ser dinámico o filtrado por `name`
        });

        if (!configuration) {
            throw new Error(`No se encontró configuración para la cookie: ${name}`);
        }

        // Si configuration.value es un JSON en string, lo parseamos
        let cookieConfig: any;
        try {
            cookieConfig = typeof configuration.value === 'string'
                ? JSON.parse(configuration.value)
                : configuration.value;
        } catch (err) {
            throw new Error(`Error parseando configuración de cookie: ${err.message}`);
        }

        return {
            httpOnly: cookieConfig?.httpOnly ?? true,
            sameSite: cookieConfig?.sameSite ?? 'none',
            secure: cookieConfig?.secure ?? true,
            domain: cookieConfig?.domain ?? undefined,
            path: cookieConfig?.path ?? '/',
            maxAge: cookieConfig?.maxAge ?? 1000 * 60 * 60, // 1 hora por defecto
            signed: cookieConfig?.signed ?? false
        };
    }

}
