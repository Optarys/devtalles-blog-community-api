import { Logger, NotImplementedException } from "@nestjs/common";

/**
 * Clase base abstracta para estrategias OAuth2.
 * 
 * Define el contrato que deben implementar todas las estrategias
 * de autenticación mediante OAuth2 (Google, Discord, GitHub, etc.).
 */
export abstract class OAuth2Strategy {
    /**
     * Logger para depuración y seguimiento.
     */
    protected logger: Logger;

    /**
     * Nombre del proveedor OAuth2 (google, discord, github, etc.)
     */
    public readonly provider: string;

    constructor(
        /**
         * Opciones de configuración de la estrategia.
         */
        protected readonly options: OAuth2Options
    ) {
        this.provider = options.provider;
    }

    /**
     * Genera la URL de autorización para redirigir al usuario al proveedor OAuth2.
     *
     * @param state Valor opcional para mantener el estado entre la petición y la respuesta (CSRF protection).
     * @returns URL completa a la que debe redirigirse el usuario para iniciar sesión.
     * @throws {NotImplementedException} Si no es implementado en la subclase.
     */
    getAuthorizationUrl(state: string): string {
        throw new NotImplementedException();
    }

    /**
     * Intercambia un "authorization code" recibido desde el proveedor
     * por un `accessToken` y opcionalmente un `refreshToken`.
     *
     * @param code Código de autorización devuelto por el proveedor tras el login.
     * @returns Promesa que resuelve en un objeto con el `accessToken` y, si aplica, `refreshToken`.
     * @throws {NotImplementedException} Si no es implementado en la subclase.
     */
    exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken?: string }> {
        throw new NotImplementedException();
    }

    /**
     * Obtiene la información básica del perfil del usuario autenticado
     * usando el `accessToken` emitido por el proveedor.
     *
     * @param accessToken Token de acceso válido emitido por el proveedor.
     * @returns Promesa que resuelve en un objeto con información mínima del usuario:
     * - `id`: identificador único en el proveedor.
     * - `email`: correo electrónico del usuario (si está disponible).
     * - `name`: nombre del usuario (si está disponible).
     * @throws {NotImplementedException} Si no es implementado en la subclase.
     */
    getUserProfile(accessToken: string): Promise<{ id: string; email?: string; name?: string }> {
        throw new NotImplementedException();
    }
}

/**
 * Opciones de configuración que deben proporcionarse a una estrategia OAuth2.
 */
export interface OAuth2Options {
    /**
     * Proveedor de autenticación (discord, google, github).
     */
    provider: 'discord' | 'google' | 'github';

    /**
     * Client ID de la aplicación registrado en el proveedor.
     */
    clientId: string;

    /**
     * Client Secret de la aplicación registrado en el proveedor.
     */
    clientSecret: string;

    /**
     * URI de redirección configurada en el proveedor para recibir el "authorization code".
     */
    redirectUri: string;
}