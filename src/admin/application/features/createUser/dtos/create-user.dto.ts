import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/admin/application/enums/user-role.enum';

export class CreateUserDto {
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

    @ApiProperty({ description: 'Rol del usuario', example: UserRole.READER, enum: UserRole })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}