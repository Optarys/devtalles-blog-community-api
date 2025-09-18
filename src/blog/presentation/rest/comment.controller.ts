import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Req,
    UseGuards,
    Res
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Result } from "@core/common/responses";
import { AddCommentCommand, AddCommentDto } from "@blog/application/features/addComment";
import { MediatorService } from "@core/common/services";
import { JwtGuard } from "@core/common/guards";
import { type Response } from "express";

@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@ApiTags("Comments")
@Controller("comments")
export class CommentController {
    constructor(private readonly mediator: MediatorService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Agregar un comentario a un Post" })
    @ApiResponse({
        status: 201,
        description: "Comentario creado exitosamente",
        schema: {
            example: {
                success: true,
                data: {
                    id: 123,
                    content: "Excelente artículo, me ayudó mucho 🚀",
                    createdAt: "2025-09-17T18:30:00.000Z",
                    authorId: "9f8a3c92-1234-4f9d-8888-7b1c2b9f3e1d",
                    postId: 42,
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: "Post o Usuario no encontrado",
        schema: {
            example: {
                success: false,
                error: "Post not found (id: 42, slug: introduccion-a-nestjs)",
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: "Validaciones fallidas",
        schema: {
            example: {
                statusCode: 400,
                message: [
                    "El contenido del comentario no puede estar vacío",
                    "Debe proporcionar al menos idPost o slugPost",
                ],
                error: "Bad Request",
            },
        },
    })
    async addComment(
        @Body() dto: AddCommentDto,
        @Res({passthrough: true}) res: Response,
        @Req() req: any) {
        const user = req['user'].sub; // usuario autenticado
        const command = new AddCommentCommand(
            dto.content,
            user,
            dto.slugPost,
            dto.idPost,
        );
        const result = await this.mediator.execute(command);

        result.match(
            () => res.status(201).send({message: 'Comentario agregado'}),
            (error, details) => res.status(400).send({ error, details })
        )
    }
}
