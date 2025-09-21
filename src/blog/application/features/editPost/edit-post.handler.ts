import { ICommandHandler } from "@core/common/handlers";
import { EditPostCommand } from "./edit-post.command";
import { Result } from "@core/common/responses";
import { Logger } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { In } from "typeorm";
import { BlogContext } from "@blog/infrastructure/context";
import { StorageService } from "@blog/application/services";
import { PostTagEntity } from "@core/persistence/models";

@CommandHandler(EditPostCommand)
export class EditPostHandler implements ICommandHandler<EditPostCommand> {
    logger = new Logger(EditPostHandler.name);

    constructor(
        private readonly blogContext: BlogContext,
        private readonly storage: StorageService
    ) { }

    async execute(command: EditPostCommand): Promise<Result<any>> {
        const { postId, title, content, summary, category, banners, tags, seoMeta } = command;

        try {
            const post = await this.blogContext.posts.findOne({
                where: { id: Number(postId) },
                relations: ["tags", "category"],
            });

            if (!post) {
                return Result.failure(`Post with id ${postId} not found`);
            }

            // Actualizar campos básicos
            if (title) {
                post.title = title;
                post.slug = this.generateSlug(title);
            }
            if (content) post.content = content;
            if (summary) post.summary = summary;
            if (seoMeta) post.seoMeta = seoMeta;
            if (banners && banners.length > 0) {

                // Eliminar imagenes
                for (const fileRef of post.bannerImages) {
                    await this.storage.deleteFile(fileRef)
                }

                post.bannerImages = [];

                // Subir nuevas imagenes
                for (const file of banners) {
                    const key = `${Date.now()}-${file.originalname}`; // evitar colisiones
                    const { key: uploadedKey } = await this.storage.uploadFile(key, file.buffer, file.mimetype);
                    post.bannerImages.push(uploadedKey);
                }
            }

            // Actualizar categoría
            if (category) {
                const cat = await this.blogContext.postCategories.findOne({ where: { slug: category } });
                if (cat) post.category = cat;
            }

            // Actualizar tags
            if (tags && tags.length > 0) {
                // Normalizar slugs de entrada
                const normalizedSlugs = tags.map(t => this.generateSlug(t));

                // Buscar los que ya existen
                const existingTags = await this.blogContext.postTags.find({
                    where: { slug: In(normalizedSlugs) }
                });

                const existingSlugs = existingTags.map(t => t.slug);

                // Determinar cuáles faltan
                const missing = normalizedSlugs.filter(slug => !existingSlugs.includes(slug));

                // Crear los faltantes
                const newTags: PostTagEntity[] = missing.map((slug, i) =>
                    this.blogContext.postTags.create({
                        slug,
                        name: tags[i] // conservar el nombre original
                    })
                );

                if (newTags.length > 0) {
                    await this.blogContext.postTags.save(newTags);
                    existingTags.push(...newTags);
                }

                // Reemplazar los tags del post (no acumular)
                post.tags = existingTags;
            }

            await this.blogContext.posts.save(post);

            this.logger.log(`Post ${post.id} actualizado correctamente`);
            return Result.success(post);
        } catch (err) {
            this.logger.error("Error al editar post", err.stack);
            return Result.failure("Error interno al editar post");
        }
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }
}
