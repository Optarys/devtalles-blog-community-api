import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { PostStatus } from '@core/persistence/models';

export class CreatePostDto {
    @ApiProperty({ description: 'Título del post', example: 'Mi primer post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Contenido del post', example: 'Este es el contenido...' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'Resumen del post', example: 'Este es el contenido...' })
    @IsString()
    @IsNotEmpty()
    summary: string;

    @ApiProperty({ description: 'Slug o nombre de la categoría', example: 'tecnologia' })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ description: 'Estado de la publicacion al momento de guardar Borrador o publicado', default: 'draft' })
    @IsOptional()
    @IsIn(['draft', 'published'])
    status: string;

    @ApiProperty({ type: String, example: '["nestjs","typescript"]' })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        try { return (value as string).split(',') } catch { return []; }
    })
    tags?: string[];

    @ApiProperty({ description: 'Meta información SEO', example: { description: 'Post sobre NestJS', keywords: ['nestjs', 'api'] }, required: false })
    @IsOptional()
    seoMeta?: Record<string, any>;
}
