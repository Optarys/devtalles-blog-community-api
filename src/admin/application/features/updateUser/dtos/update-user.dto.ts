import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsUUID } from 'class-validator';
import { UserRole } from 'src/admin/application/enums/user-role.enum';

export class UpdateUserDto {

    @ApiPropertyOptional({ description: 'Nombre del usuario', example: 'Kevin' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ description: 'Apellido del usuario', example: 'Ortiz' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ description: 'Correo electrónico del usuario', example: 'user@example.com' })
    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value === '' ? undefined : value)
    email?: string;

    @ApiPropertyOptional({ description: 'Username opcional', example: 'kevin123' })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({ description: 'Contraseña', example: 'Password123!' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value === '' ? undefined : value)
    password?: string;

    @ApiPropertyOptional({ description: 'Rol del usuario', example: UserRole.READER, enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({ description: 'Biografía del usuario', example: 'Me gusta programar' })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Avatar del usuario' })
    @IsOptional()
    avatar?: Express.Multer.File;
}
