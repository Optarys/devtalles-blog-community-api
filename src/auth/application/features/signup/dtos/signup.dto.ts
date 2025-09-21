import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Kevin' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Ortiz' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username opcional', example: 'kevin123', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Contraseña', example: 'Password123!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
