import { UserEntity } from '@core/persistence/models';
import { UserType } from '../types/user.type';
import { StatusMapper } from './status.mapper';
import { RoleMapper } from './role.mapper';
import { PostMapper } from './post.mapper';
import { PostCommentMapper } from './post-comment.mapper';
import { SavedPostMapper } from './saved-post.mapper';

export class UserMapper {
  static toGraphQL(entity: UserEntity): UserType {
    return {
      id: entity.id,
      externalId: entity.externalId,
      firstName: entity.firstName,
      lastName: entity.lastName,
      username: entity.username,
      email: entity.email,
      isActive: entity.isActive,
      bio: entity.bio,
      avatarUrl: entity.avatarUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,

      status: entity.status ?? StatusMapper.toGraphQL(entity.status),
      roles: entity.roles ? entity.roles.map(RoleMapper.toGraphQL) : [],
      posts: entity.posts ? entity.posts.map(PostMapper.toGraphQL) : [],
      comments: entity.comments ? entity.comments.map(PostCommentMapper.toGraphQL) : [],
      savedPosts: entity.savedPosts ? entity.savedPosts.map(SavedPostMapper.toGraphQL) : [],
    };
  }

  static toGraphQLList(entities: UserEntity[]): UserType[] {
    return entities.map((e) => this.toGraphQL(e));
  }
}