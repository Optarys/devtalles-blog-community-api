import { BlogContext } from '@blog/infrastructure/context';
import { Resolver, Query, ResolveField, Parent, Int, Args } from '@nestjs/graphql';
import { PostType } from './types/post-type';
import { CommentType } from './types/comment-type';

@Resolver(() => PostType)
export class BlogResolver {
    constructor(private readonly blogContext: BlogContext) { }

    // Devuelve todas las publicaciones
    @Query(() => [PostType], { name: 'posts' })
    async posts(@Args('slug', { type: () => String, nullable: true }) slug?: string,
        @Args('status', { type: () => String, nullable: true }) status?: string,
        @Args('categoryId', { type: () => Int, nullable: true }) categoryId?: number,
        @Args('tagIds', { type: () => [Int], nullable: true }) tagIds?: number[],
        @Args('from', { type: () => String, nullable: true }) from?: string, // fecha ISO
        @Args('to', { type: () => String, nullable: true }) to?: string,     // fecha ISO
    ): Promise<PostType[]> {
        let query = this.blogContext.posts
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.category', 'category')
            .leftJoinAndSelect('post.tags', 'tags')
            .leftJoinAndSelect('post.comments', 'comments');

        // Aplicar filtros
        if (slug) query = query.andWhere('post.slug = :slug', { slug });
        if (status) query = query.andWhere('post.status = :status', { status });
        if (categoryId) query = query.andWhere('post.category_id = :categoryId', { categoryId });
        if (tagIds && tagIds.length > 0) query = query.andWhere('tags.id IN (:...tagIds)', { tagIds });
        if (from) query = query.andWhere('post.created_at >= :from', { from });
        if (to) query = query.andWhere('post.created_at <= :to', { to });

        const result = query.getMany(); 

        (await result).flatMap((post) => )
    }

    // Resuelve los comentarios de cada publicación
    @ResolveField(() => [CommentType], { name: 'comments', nullable: 'itemsAndList' })
    async comments(@Parent() post: PostType): Promise<CommentType[]> {
        return this.blogContext.getCommentsByPost(post.id); // Método para traer comentarios por postId
    }
}
