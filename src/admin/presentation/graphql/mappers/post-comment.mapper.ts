import { PostCommentEntity } from '@core/persistence/models';
import { PostCommentType } from '../types/post-comment.type';

export class PostCommentMapper {
  static toGraphQL(entity: PostCommentEntity): PostCommentType {
    return {
      id: entity.id,
      content: entity.content,
      isModerated: entity.isModerated,
      createdAt: entity.createdAt,
    };
  }

  static toGraphQLList(entities: PostCommentEntity[]): PostCommentType[] {
    return entities.map((e) => this.toGraphQL(e));
  }
}
