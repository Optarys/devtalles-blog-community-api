// posts.controller.ts
import { Controller, Post, Body, UseInterceptors, UploadedFiles, Logger, UseGuards, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Result } from '@core/common/responses';
import { CreatePostCommand, CreatePostDto } from '@blog/application/features/createPost';
import { JwtGuard } from '@core/common/guards';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MediatorService } from '@core/common/services';

@ApiBearerAuth('access-token')
@Controller('posts')
export class PostsController {
    private readonly logger = new Logger(PostsController.name);

    constructor(private readonly mediator: MediatorService) { }

    @Post()
    @UseGuards(JwtGuard)
    @UseInterceptors(FilesInterceptor('banners'))
    @ApiOperation({ summary: 'Crea un nuevo post' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos para crear un post con archivos',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Mi primer post' },
                content: { type: 'string', example: 'Contenido del post...' },
                category: { type: 'string', example: 'tecnologia' },
                tags: { type: 'string', example: '["nestjs","typescript"]' }, // se recibe como JSON string
                seoMeta: { type: 'string', example: '{"keywords":"blog,nestjs"}' }, // JSON string
                banners: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' }, // archivos
                },
            },
            required: ['title', 'content', 'category'],
        },
    })

    @ApiResponse({ status: 201, description: 'Post creado correctamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    async createPost(
        @Body() body: CreatePostDto,
        @UploadedFiles() banners: Express.Multer.File[],
        @Req() req: any, // request con user
    ): Promise<Result<any>> {
        console.log(banners)
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
}
