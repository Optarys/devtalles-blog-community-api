import { BlogContext } from '@blog/infrastructure/context';
import { Injectable } from '@nestjs/common';
import { PostCommentEntity, PostEntity, PostCategoryEntity, PostTagEntity } from '@core/persistence/models';

interface PostFilters {
    author?: string;
    slug?: string;
    status?: string;
    categories?: string[];
    tags?: string[];
    from?: string; // ISO date string
    to?: string;   // ISO date string
}

@Injectable()
export class PostsService {
    constructor(private readonly context: BlogContext) { }

    async findAllBy(filters: PostFilters): Promise<PostEntity[]> {
        let query = this.context.posts
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.category', 'category')

        if(filters.author) query = query.andWhere('author.external_id = :id', {id: filters.author});
        if (filters.slug) query = query.andWhere('post.slug = :slug', { slug: filters.slug });
        if (filters.status) query = query.andWhere('post.status = :status', { status: filters.status });
        if (filters.categories) query = query.andWhere('category.slug IN (:...categories)', { categories: filters.categories });
        if (filters.from) query = query.andWhere('post.created_at >= :from', { from: filters.from });
        if (filters.to) query = query.andWhere('post.created_at <= :to', { to: filters.to });

        // Filtrar por tags
        if (filters.tags && filters.tags.length > 0) {
            query = query
                .innerJoin('post.tags', 'tag') // join a la tabla de tags
                .andWhere('tag.slug IN (:...tags)', { tags: filters.tags });
        }

        return await query.getMany();
    }


    async findCommentsByPostId(postId: number): Promise<PostCommentEntity[]> {
        return await this.context.postComments
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .where('comment.post_id = :postId', { postId })
            .getMany();
    }

    async findTagsByPostId(postId: number): Promise<PostTagEntity[]> {
        return await this.context.postTags
            .createQueryBuilder('tag')
            .innerJoin('tag.posts', 'post', 'post.id = :postId', { postId })
            .getMany();
    }

    async findCategoriesByPostId(postId: number): Promise<PostCategoryEntity[]> {
        return await this.context.postCategories
            .createQueryBuilder('ct')
            .innerJoin('ct.posts', 'post', 'post.id = :postId', { postId })
            .getMany();
    }

}