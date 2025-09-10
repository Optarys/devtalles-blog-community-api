import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

import {
    Role,
    Permission,
    UserStatus,
    User,
    UserCredential,
    AuthProvider,
    UserIdentity,
    PostCategory,
    Post,
    PostTag,
    Comment,
    UserSession,
} from "@core/persistence/models";

@Injectable()
export class AppContext {
    constructor(private readonly dataSource: DataSource) { }

    /* -------------------- GETTERS -------------------- */
    get roles(): Repository<Role> {
        return this.dataSource.getRepository(Role);
    }

    get permissions(): Repository<Permission> {
        return this.dataSource.getRepository(Permission);
    }

    get userStatuses(): Repository<UserStatus> {
        return this.dataSource.getRepository(UserStatus);
    }

    get users(): Repository<User> {
        return this.dataSource.getRepository(User);
    }

    get userCredentials(): Repository<UserCredential> {
        return this.dataSource.getRepository(UserCredential);
    }

    get authProviders(): Repository<AuthProvider> {
        return this.dataSource.getRepository(AuthProvider);
    }

    get userIdentities(): Repository<UserIdentity> {
        return this.dataSource.getRepository(UserIdentity);
    }

    get postCategories(): Repository<PostCategory> {
        return this.dataSource.getRepository(PostCategory);
    }

    get posts(): Repository<Post> {
        return this.dataSource.getRepository(Post);
    }

    get postTags(): Repository<PostTag> {
        return this.dataSource.getRepository(PostTag);
    }

    get comments(): Repository<Comment> {
        return this.dataSource.getRepository(Comment);
    }

    get userSessions(): Repository<UserSession> {
        return this.dataSource.getRepository(UserSession);
    }
}