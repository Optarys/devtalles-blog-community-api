
import { PostSavedEntity } from '@core/persistence/models/post_saved.model';
import { SavedPostsType } from '../types/saved-posts.type';

export class SavedPostMapper {
  static toGraphQL(entity: PostSavedEntity): SavedPostsType {
    return {
      id: entity.id,
      title: entity.post?.title ?? null,
      savedAt: entity.savedAt,
    };
  }

  static toGraphQLList(entities: PostSavedEntity[]): SavedPostsType[] {
    return entities.map((e) => this.toGraphQL(e));
  }
}
