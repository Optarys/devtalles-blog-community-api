import { PostCommentEntity, PostEntity, PostTagEntity } from "@core/persistence/models";
import { PostType } from "../types/post-type";
import { CommentType } from "../types/comment-type";
import { TagType } from "../types/tag-type";

export class PostMapper {
    static toGraphQL(entity: PostEntity): PostType {
        const endpoint = `${process.env.BASE_HOST_STORAGE}`;
        return {
            id: entity.id,
            title: entity.title,
            slug: entity.slug,
            category: entity.category
                ? {
                    name: entity.category.name,
                    slug: entity.category.slug,
                    description: entity.category.description,
                }
                : undefined,
            content: entity.content,
            summary: entity.summary,
            banners: entity.bannerImages?.map((key) => ({
                key,
                url: encodeURI(`${endpoint}/${key}`),
            })),
            authorId: entity.author?.externalId,
            seoMeta: entity.seoMeta,
            publishedAt: entity.publishedAt,
            comments: [], // Carga diferida
            tags: [], // Carga diferida
        };
    }



    // Mapea un comentario
    static commentToGraphQL(comment: PostCommentEntity): CommentType {
        return {
            id: comment.id,
            authorName: comment.user.username,
            authorEmail: comment.user.email,
            content: comment.content,
            isModerated: comment.isModerated,
            createdAt: comment.createdAt,
        };
    }

    // Mapea un tag
    static tagToGraphQL(tag: PostTagEntity): TagType {
        return {
            name: tag.name,
            slug: tag.slug,
        };
    }

    static toGraphQLList(entities: PostEntity[]): PostType[] {
        return entities.map((e) => this.toGraphQL(e));
    }
}
