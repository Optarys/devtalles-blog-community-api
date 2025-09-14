import { Comment, Post, PostTag } from "@core/persistence/models";
import { PostType } from "../types/post-type";
import { CommentType } from "../types/comment-type";
import { TagType } from "../types/tag-type";

export class PostMapper {
    static toGraphQL(entity: Post): PostType {
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
            authorId: entity.author?.externalId,
            seoMeta: entity.seoMeta,
            publishedAt: entity.publishedAt,
            comments: [], // Carga diferida
            tags: [], // Carga diferida
        };
    }



    // Mapea un comentario
    static commentToGraphQL(comment: Comment): CommentType {
        return {
            authorName: comment.authorName,
            authorEmail: comment.authorEmail,
            content: comment.content,
            isModerated: comment.isModerated,
            createdAt: comment.createdAt,
        };
    }

    // Mapea un tag
    static tagToGraphQL(tag: PostTag): TagType {
        return {
            name: tag.name,
            slug: tag.slug,
        };
    }

    static toGraphQLList(entities: Post[]): PostType[] {
        return entities.map((e) => this.toGraphQL(e));
    }
}
