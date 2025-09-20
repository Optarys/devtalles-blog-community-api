import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DeleteCommentDto {
  @ApiProperty({
    description: 'Identificador único del comentario a eliminar',
    example: 123,
  })
  @IsInt({ message: 'El ID del comentario debe ser un número entero' })
  @Min(1, { message: 'El ID del comentario debe ser mayor que 0' })
  commentId: number;
}