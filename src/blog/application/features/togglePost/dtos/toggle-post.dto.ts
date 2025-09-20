import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class TogglePostDto {
  @ApiPropertyOptional({
    description: 'Identificador único del post (opcional si se envía el slug)',
    example: 123,
  })
  @IsOptional()
  @IsInt({ message: 'El ID del post debe ser un número entero' })
  @IsPositive({ message: 'El ID del post debe ser mayor que 0' })
  postId?: number;

  @ApiPropertyOptional({
    description: 'Slug único del post (opcional si se envía el ID)',
    example: 'mi-post-de-prueba',
  })
  @IsOptional()
  @IsString({ message: 'El slug debe ser un texto' })
  @MinLength(3, { message: 'El slug debe tener al menos 3 caracteres' })
  postSlug?: string;

  @ApiProperty({
    description: 'Estado al que se quiere cambiar el post',
    example: 'published',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  @IsEnum(['draft', 'published', 'archived'], { message: 'El estado debe ser draft o published' })
  status: 'draft' | 'published' | 'archived' = 'draft';
}