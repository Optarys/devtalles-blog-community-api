import { UserStatusEntity } from '@core/persistence/models';
import { StatusType } from '../types/status.type';

export class StatusMapper {
  static toGraphQL(entity: UserStatusEntity): StatusType {
    return {
      code: entity.code,
      name: entity.name,
      description: entity.description,
    };
  }

  static toGraphQLList(entities: UserStatusEntity[]): StatusType[] {
    return entities.map((e) => this.toGraphQL(e));
  }
}
