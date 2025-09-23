import { Controller, Post, Body, UseInterceptors, UploadedFiles, Logger, UseGuards, Req, Patch, HttpCode, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Result } from '@core/common/responses';
import { CreatePostCommand, CreatePostDto } from '@blog/application/features/createPost';
import { JwtGuard } from '@core/common/guards';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MediatorService } from '@core/common/services';
import { TogglePostCommand, TogglePostDto } from '@blog/application/features/togglePost';
import { SavePostCommand, SavePostDto } from '@blog/application/features/savePost';
import { EditPostCommand, EditPostDto } from '@blog/application/features/editPost';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
    private readonly logger = new Logger(PostsController.name);

    constructor(private readonly mediator: MediatorService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('banners'))
    @ApiOperation({ summary: 'Crea un nuevo post' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Post creado correctamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    async createPost(
        @Body() body: CreatePostDto,
        @UploadedFiles() banners: Express.Multer.File[],
        @Req() req: any, // request con user
    ): Promise<Result<any>> {
        const user = req['user'].sub; // usuario autenticado
        const command = new CreatePostCommand(
            body.title,
            body.content,
            body.summary,
            user,
            body.category,
            body.status,
            banners || [],
            body.tags || [],
            body.seoMeta
        );
        try {
            const result = await this.mediator.execute(command);

            return result.match(
                (value) => value,
                (error, details) => ({ error, details })
            )

        } catch (error) {
            this.logger.error('Error en createPost endpoint', error);
            return Result.failure('Error al crear post');
        }
    }


    @Patch(":id")
    @ApiOperation({ summary: "Editar un post existente" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Datos para editar un post",
        type: EditPostDto,
    })
    @ApiResponse({
        status: 200,
        description: "Post actualizado correctamente",
    })
    @UseInterceptors(FilesInterceptor("banners")) // maneja múltiples archivos
    async editPost(
        @Param("id") id: string,
        @Body() dto: EditPostDto,
        @UploadedFiles() banners: Express.Multer.File[],
    ) {
        const command = new EditPostCommand(
            id,
            dto.title,
            dto.content,
            dto.summary,
            dto.category,
            banners,
            dto.tags,
            dto.seoMeta,
        );

        return this.mediator.execute(command);
    }


    @Patch(':id/toggle-status')
    @HttpCode(200)
    @ApiOperation({ summary: 'Cambia el estado de un post (draft/published/archived)' })
    @ApiResponse({
        status: 200,
        description: 'Post actualizado correctamente',
        schema: {
            example: {
                success: true,
                message: 'Post actualizado correctamente',
                postId: 123,
                slug: 'mi-post-de-prueba',
                status: 'published',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Post no encontrado',
        schema: {
            example: {
                statusCode: 404,
                message: 'Post 999 no encontrado',
                error: 'Not Found',
            },
        },
    })
    async togglePost(
        @Body() dto: TogglePostDto,
        @Param("id") id: number) {
        return this.mediator.execute(
            new TogglePostCommand(id, dto.status),
        );
    }


    @Post(':id/save')
    @ApiOperation({ summary: 'Guardar un post para el usuario' })
    async savePost(
        @Param("id") id: number,
        @Req() req: any) {
        const user = req['user'].sub; // usuario autenticado
        return this.mediator.execute(
            new SavePostCommand(user, id),
        );
    }
}
