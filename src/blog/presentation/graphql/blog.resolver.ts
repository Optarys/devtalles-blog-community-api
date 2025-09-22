import { Resolver, Query, ResolveField, Parent, Int, Args } from '@nestjs/graphql';
import { PostType } from './types/post-type';
import { CommentType } from './types/comment-type';
import { PostsService } from '@blog/application/services';
import { PostMapper } from './mappers/post-mapper-extensions';
import { TagType } from './types/tag-type';

@Resolver(() => PostType)
export class BlogResolver {

    constructor(private readonly postsService: PostsService) { }

    // Devuelve todas las publicaciones
    @Query(() => [PostType], { name: 'posts' })
    async posts(
        @Args('author', { type: () => String, nullable: true }) author?: string,
        @Args('slug', { type: () => String, nullable: true }) slug?: string,
        @Args('status', { type: () => String, nullable: true }) status?: string,
        @Args('categories', { type: () => [String], nullable: true }) categories?: string[],
        @Args('tags', { type: () => [String], nullable: true }) tags?: string[],
        @Args('from', { type: () => String, nullable: true }) from?: string, // fecha ISO
        @Args('to', { type: () => String, nullable: true }) to?: string,     // fecha ISO
    ): Promise<PostType[]> {
        const posts = await this.postsService.findAllBy({author: author, slug, status, categories, tags, from, to });
        return PostMapper.toGraphQLList(posts);
    }

    // Resuelve los comentarios de cada publicación
    @ResolveField(() => [CommentType], { name: 'comments', nullable: 'itemsAndList' })
    async comments(@Parent() post: PostType): Promise<CommentType[]> {
        // Lazy loading solo si no se cargaron por filtro
        const comments = await this.postsService.findCommentsByPostId(post.id);
        return comments.map(c => PostMapper.commentToGraphQL(c));
    }

    // Resuelve los tags de cada publicacion
    @ResolveField(() => [TagType], { name: 'tags', nullable: 'itemsAndList' })
    async postTags(@Parent() post: PostType): Promise<TagType[]> {
        // Lazy loading solo si no se cargaron por filtro
        const tags = await this.postsService.findTagsByPostId(post.id);
        return tags.map(t => PostMapper.tagToGraphQL(t));
    }

}