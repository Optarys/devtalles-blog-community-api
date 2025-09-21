import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
    @ApiProperty({
        description: 'Correo electrónico o username del usuario',
        example: 'user@example.com',
    })
    @IsNotEmpty()
    @IsString()
    identifier: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Password123!',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
