import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserType } from './types/user.type';
import { UserService } from 'src/admin/application/services/user.service';
import { UserMapper } from './mappers/user.mapper';
import { SavedPostsType } from './types/saved-posts.type';
import { UserEntity } from '@core/persistence/models';
import { PostCommentType } from './types/post-comment.type';
import { PostUserType } from './types/post-user.type';
import { StatusType } from './types/status.type';
import { RoleType } from './types/role.type';
import { SavedPostMapper } from './mappers/saved-post.mapper';
import { RoleMapper } from './mappers/role.mapper';
import { StatusMapper } from './mappers/status.mapper';
import { PostMapper } from './mappers/post.mapper';
import { PostCommentMapper } from './mappers/post-comment.mapper';

@Resolver(() => UserType)
export class UsersResolver {
    constructor(private readonly userService: UserService) { }

    // Query: obtener todos
    @Query(() => [UserType], { name: 'users' })
    async getUsers(
        @Args('externalId', { type: () => String, nullable: true }) externalId?: string,
        @Args('status', { type: () => String, nullable: true }) status?: 'active' | 'deleted') {
        const users = await this.userService.findAllBy(externalId, status);
        return UserMapper.toGraphQLList(users);
    }

    // Field resolvers (lazy load)
    @ResolveField(() => StatusType)
    async status(@Parent() user: UserEntity) {
        const entity = await this.userService.findStatus(user.id);
        return entity ? StatusMapper.toGraphQL(entity) : null;
    }

    @ResolveField(() => [RoleType])
    async roles(@Parent() user: UserEntity) {
        const roles = await this.userService.findRoles(user.id);
        return RoleMapper.toGraphQLList(roles);
    }

    @ResolveField(() => [PostUserType], { nullable: true })
    async posts(@Parent() user: UserEntity) {
        const posts = await this.userService.findPosts(user.id);
        return PostMapper.toGraphQLList(posts);
    }

    @ResolveField(() => [PostCommentType], { nullable: true })
    async comments(@Parent() user: UserEntity) {
        const comments = await this.userService.findComments(user.id);
        return PostCommentMapper.toGraphQLList(comments);
    }

    @ResolveField(() => [SavedPostsType], { nullable: true })
    async savedPosts(@Parent() user: UserEntity) {
        const savedPosts = await this.userService.findSavedPosts(user.id);
        return SavedPostMapper.toGraphQLList(savedPosts);
    }
}
