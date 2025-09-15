import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

import {
    RoleEntity,
    PermissionEntity,
    UserStatusEntity,
    UserEntity,
    UserCredentialEntity,
    AuthProviderEntity,
    UserIdentityEntity,
    PostCategoryEntity,
    PostEntity,
    PostTagEntity,
    CommentEntity,
    UserSessionEntity,
} from "@core/persistence/models";
import { ConfigurationModel } from "../models/config.model";

@Injectable()
export class AppContext {
    constructor(private readonly dataSource: DataSource) { }

    get context(): DataSource {
        return this.dataSource;
    }

    get configuration(): Repository<ConfigurationModel> {
        return this.dataSource.getRepository(ConfigurationModel)
    }
    /* -------------------- GETTERS -------------------- */
    get roles(): Repository<RoleEntity> {
        return this.dataSource.getRepository(RoleEntity);
    }

    get permissions(): Repository<PermissionEntity> {
        return this.dataSource.getRepository(PermissionEntity);
    }

    get userStatuses(): Repository<UserStatusEntity> {
        return this.dataSource.getRepository(UserStatusEntity);
    }

    get users(): Repository<UserEntity> {
        return this.dataSource.getRepository(UserEntity);
    }

    get userCredentials(): Repository<UserCredentialEntity> {
        return this.dataSource.getRepository(UserCredentialEntity);
    }

    get authProviders(): Repository<AuthProviderEntity> {
        return this.dataSource.getRepository(AuthProviderEntity);
    }

    get userIdentities(): Repository<UserIdentityEntity> {
        return this.dataSource.getRepository(UserIdentityEntity);
    }

    get postCategories(): Repository<PostCategoryEntity> {
        return this.dataSource.getRepository(PostCategoryEntity);
    }

    get posts(): Repository<PostEntity> {
        return this.dataSource.getRepository(PostEntity);
    }

    get postTags(): Repository<PostTagEntity> {
        return this.dataSource.getRepository(PostTagEntity);
    }

    get comments(): Repository<CommentEntity> {
        return this.dataSource.getRepository(CommentEntity);
    }

    get userSessions(): Repository<UserSessionEntity> {
        return this.dataSource.getRepository(UserSessionEntity);
    }
}