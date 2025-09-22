import { JwtGuard } from '@core/common/guards';
import { MediatorService } from '@core/common/services';
import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateUserCommand, CreateUserDto } from 'src/admin/application/features/createUser';
import { DeleteUserCommand } from 'src/admin/application/features/deleteUser';
import { UpdateUserCommand, UpdateUserDto } from 'src/admin/application/features/updateUser';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {

    constructor(private readonly mediator: MediatorService) { }

    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        // Preparar los datos para la entidad
        const result = await this.mediator.execute(
            new CreateUserCommand(
                dto.firstName,
                dto.lastName,
                dto.email,
                dto.role,
                dto.password,
                dto.username
            ));
        return result;
    }

    @Patch(':externalId')
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiConsumes('multipart/form-data')
    async updateUser(
        @Param('externalId') externalId: string,
        @Body() dto: UpdateUserDto,
        @UploadedFile() avatar?: Express.Multer.File,
    ) {
        const result = await this.mediator.execute(
            new UpdateUserCommand(
                externalId,
                dto.firstName,
                dto.lastName,
                dto.email,
                dto.username,
                dto.password,
                dto.role,
                dto.bio,
                avatar
            ));
        return result;
    }

    @Delete(':externalId')
    @ApiOperation({ summary: 'Elimina un usuario (Soft Delete)' })
    async deleteUser(@Param('externalId') externalId: string) {
        return this.mediator.execute(new DeleteUserCommand(externalId));
    }
}
