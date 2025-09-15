import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogContext } from '@blog/infrastructure/context';
import { Post } from '@blog/domain/entities/post';
import { PostEntity, PostStatus } from '@core/persistence/models';
import { PostTag } from '@core/persistence/models/post-tag.model';
import { parseEnum } from '@core/helpers';

@Injectable()
export class PostRepository {
    constructor(private readonly context: BlogContext) { }

    async save(post: Post): Promise<Post> {
        return await this.context.dtSource.manager.transaction(async (manager) => {
            // 1️⃣ Mapear Aggregate Root -> Entity
            const entity = new PostEntity();
            entity.title = post.getTitle();
            entity.slug = post.getSlug();
            entity.content = post.getContent();
            entity.seoMeta = post.getSeoMeta() || {};
            entity.publishedAt = post.getPublishedAt();
            entity.summary = post.getSummary();
            entity.status = parseEnum(PostStatus, post.getStatus());

            // Usar manager para las consultas relacionadas
            const category = await manager.findOneBy(this.context.postCategories.target, {
                slug: post.getCategory().getSlug(),
            });

            if (!category) {
                throw new NotFoundException(`Categoria ${post.getCategory().getSlug()} no existe.`);
            }
            entity.category = category;

            const author = await manager.findOneBy(this.context.postAuthor.target, {
                externalId: post.getAuthorId(),
            });

            if (!author) {
                throw new NotFoundException('Usuario autor no existe');
            }
            entity.author = author;

            // 2️⃣ Mapear tags
            const tags: PostTag[] = [];
            for (const t of post.getTags()) {
                let existing = await manager.findOne(this.context.postTags.target, {
                    where: { slug: t.getSlug() },
                });
                if (!existing) {
                    existing = manager.create(this.context.postTags.target, {
                        slug: t.getSlug(),
                        name: t.getName(),
                    });
                    existing = await manager.save(this.context.postTags.target, existing);
                }
                tags.push(existing);
            }
            entity.tags = tags;

            // 3️⃣ Banner images (ajusta si usas JSONB o relación aparte)
            entity.bannerImages = post.getBannerImages();

            // 4️⃣ Guardar Post
            const saved = await manager.save(PostEntity, entity);

            // 5️⃣ Reflejar en el Aggregate Root
            post.setId(saved.id);

            return post;
        });
    }

    async updatePartial(post: Post): Promise<Post> {
        return await this.context.dtSource.manager.transaction(async (manager) => {
            // 1️⃣ Buscar post existente
            const existing = await manager.findOne(PostEntity, {
                where: { id: post.getId() },
                relations: ['category', 'author', 'tags'],
            });

            if (!existing) {
                throw new NotFoundException(`Post ${post.getId()} no existe.`);
            }

            // 2️⃣ Aplicar cambios parciales
            if (post.getTitle()) existing.title = post.getTitle();
            if (post.getSlug()) existing.slug = post.getSlug();
            if (post.getContent()) existing.content = post.getContent();
            if (post.getSeoMeta()) existing.seoMeta = post.getSeoMeta();
            if (post.getPublishedAt()) existing.publishedAt = post.getPublishedAt();
            if (post.getSummary()) existing.summary = post.getSummary();

            // 3️⃣ Categoria (solo si cambió)
            if (post.getCategory()) {
                const category = await manager.findOneBy(this.context.postCategories.target, {
                    slug: post.getCategory().getSlug(),
                });
                if (!category) {
                    throw new NotFoundException(`Categoria ${post.getCategory().getSlug()} no existe.`);
                }
                existing.category = category;
            }

            // 4️⃣ Autor (si cambió)
            if (post.getAuthorId()) {
                const author = await manager.findOneBy(this.context.postAuthor.target, {
                    externalId: post.getAuthorId(),
                });
                if (!author) {
                    throw new NotFoundException('Usuario autor no existe');
                }
                existing.author = author;
            }

            // 5️⃣ Tags (si se mandaron nuevos)
            if (post.getTags() && post.getTags().length > 0) {
                const tags: PostTag[] = [];
                for (const t of post.getTags()) {
                    let existingTag = await manager.findOne(this.context.postTags.target, {
                        where: { slug: t.getSlug() },
                    });
                    if (!existingTag) {
                        existingTag = manager.create(this.context.postTags.target, {
                            slug: t.getSlug(),
                            name: t.getName(),
                        });
                        existingTag = await manager.save(this.context.postTags.target, existingTag);
                    }
                    tags.push(existingTag);
                }
                existing.tags = tags;
            }

            // 6️⃣ Banner images (si llegan, reemplazar)
            if (post.getBannerImages() && post.getBannerImages().length > 0) {
                existing.bannerImages = post.getBannerImages();
            }

            // 7️⃣ Guardar cambios
            const saved = await manager.save(PostEntity, existing);

            // 8️⃣ Reflejar en el aggregate root
            post.setId(saved.id);

            return post;
        });
    }

}