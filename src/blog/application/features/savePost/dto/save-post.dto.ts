import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SavePostDto {
    @ApiPropertyOptional({
        description: 'ID del post a guardar (opcional si se envía slug)',
        example: 456,
    })
    @IsOptional()
    @IsInt({ message: 'El postId debe ser un número entero' })
    @Type(() => Number) // ⚡ Convierte automáticamente a number
    postId?: number;

    @ApiPropertyOptional({
        description: 'Slug del post a guardar (opcional si se envía postId)',
        example: 'mi-post-de-prueba',
    })
    @IsOptional()
    @IsString({ message: 'El postSlug debe ser un texto' })
    postSlug?: string;
}
