import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class EditPostDto {


    @ApiPropertyOptional({
        description: "Título del post",
        example: "Cómo usar CQRS en NestJS",
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @ApiPropertyOptional({
        description: "Contenido completo del post",
        example: "<p>Este es el contenido del artículo...</p>",
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({
        description: "Resumen del post",
        example: "Un resumen breve del post...",
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    summary?: string;

    @ApiPropertyOptional({
        description: "Slug de la categoría a la que pertenece el post",
        example: "nestjs",
    })
    @IsOptional()
    @IsString()
    category?: string;


    @ApiPropertyOptional({
        description: "Archivos de banner (imágenes)",
        type: "string",
        format: "binary",
        isArray: true,
    })
    @IsOptional()
    banners?: Express.Multer.File[];

    @ApiPropertyOptional({ type: String, example: '["nestjs","typescript"]' })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        try { return (value as string).split(',') } catch { return []; }
    })
    tags?: string[];

    @ApiPropertyOptional({
        description: "Metadatos SEO en formato JSON",
        example: {
            title: "Cómo usar CQRS en NestJS",
            description: "Aprende a implementar CQRS en tu proyecto NestJS",
            keywords: ["nestjs", "cqrs", "arquitectura"]
        },
    })
    @IsOptional()
    seoMeta?: Record<string, any>;
}
