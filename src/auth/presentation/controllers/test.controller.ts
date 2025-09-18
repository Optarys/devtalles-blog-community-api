import { Controller, Get, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type Response } from 'express';

@Controller('test')
export class TestController {
    constructor(private jwt: JwtService) { }
    @Get('set-cookie')
    setCookie(@Res({ passthrough: true }) res: Response) {
        res.cookie('jwt', 'mi-token-falso-123', {
            httpOnly: true,       // 🔒 no accesible por JS en el front
            secure: true,         // ⚠️ requiere HTTPS (para localhost ponlo en false si quieres probar)
            sameSite: 'lax',     // necesario si tu front está en otro dominio
            maxAge: 1000 * 60 * 60, // 1 hora
        });

        return { message: 'Cookie enviada 🚀' };
    }

    @Get('check-cookie')
    checkCookie(@Res() res: Response) {
        // ⚠️ Si usas cookie-parser middleware en main.ts:
        // app.use(cookieParser());
        // entonces podrás leerla así:
        return res.json({
            message: 'Cookie recibida',
            cookies: res.req.cookies,
        });
    }

    @Get('login-test')
    loginTest(@Res({ passthrough: true }) res: Response) {
        // Genera un JWT de prueba
        const token = this.jwt.sign({ user: 'kevin', role: 'reader' });

        // Enviar cookie cross-site (frontend separado)
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true, // HTTPS obligatorio
            sameSite: 'lax', // Crucial para cross-site
            domain: '.onrender.com',
            maxAge: 60 * 60 * 1000, // 1 hora
        });

        return { message: 'Cookie enviada ✅' };
    }

    @Get('whoami')
    whoAmI(@Req() req: Request, @Res() res: Response) {
        const token = (req as any).cookies?.jwt;
        if (!token) return res.status(401).json({ message: 'No cookie received 🚫' });

        try {
            const payload = this.jwt.verify(token);
            return res.json({ message: 'Cookie recibida ✅', payload });
        } catch {
            return res.status(401).json({ message: 'Token inválido 🚫' });
        }
    }
}
