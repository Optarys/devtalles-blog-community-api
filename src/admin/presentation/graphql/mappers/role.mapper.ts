import { RoleEntity } from '@core/persistence/models';
import { RoleType } from '../types/role.type';

export class RoleMapper {
  static toGraphQL(entity: RoleEntity): RoleType {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  static toGraphQLList(entities: RoleEntity[]): RoleType[] {
    return entities.map((e) => this.toGraphQL(e));
  }
}
