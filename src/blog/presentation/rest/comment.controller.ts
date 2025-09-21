import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Req,
    UseGuards,
    Res,
    Delete,
    Param
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AddCommentCommand, AddCommentDto } from "@blog/application/features/addComment";
import { MediatorService } from "@core/common/services";
import { JwtGuard } from "@core/common/guards";
import { type Response } from "express";
import { DeleteCommentCommand, DeleteCommentDto } from "@blog/application/features/deleteComment";

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
        @Res({ passthrough: true }) res: Response,
        @Req() req: any) {
        const user = req['user'].sub; // usuario autenticado
        const command = new AddCommentCommand(
            dto.content,
            user,
            dto.postId,
        );
        const result = await this.mediator.execute(command);

        result.match(
            () => res.status(201).send({ message: 'Comentario agregado' }),
            (error, details) => res.status(400).send({ error, details })
        )
    }


    @Delete(":id")
    @HttpCode(200)
    @ApiOperation({ summary: 'Elimina un comentario (soft delete con moderación)' })
    @ApiResponse({
        status: 200,
        description: 'Comentario eliminado correctamente',
        schema: {
            example: {
                success: true,
                message: 'Comentario eliminado correctamente',
                commentId: 123,
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Comentario no encontrado',
        schema: {
            example: {
                statusCode: 404,
                message: 'Comentario con id 999 no encontrado',
                error: 'Not Found',
            },
        },
    })
    async deleteComment(
        @Param("id") id: number,
        @Req() req: any) {
        const user = req['user'].sub; // usuario autenticado
        return this.mediator.execute(
            new DeleteCommentCommand(user, id),
        );
    }
}
