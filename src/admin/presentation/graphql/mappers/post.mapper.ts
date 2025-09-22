import { PostEntity } from '@core/persistence/models';
import { PostUserType } from '../types/post-user.type';

export class PostMapper {
  static toGraphQL(entity: PostEntity): PostUserType {
    return {
      id: entity.id,
      title: entity.title,
      summary: entity.summary,
      publishedAt: entity.publishedAt,
    };
  }

  static toGraphQLList(entities: PostEntity[]): PostUserType[] {
    return entities.map((e) => this.toGraphQL(e));
  }
}
