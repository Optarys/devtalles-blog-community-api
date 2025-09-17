import { AppContext } from "@core/persistence/context/app.context";
import { CommentEntity, PostEntity, PostCategoryEntity, PostTagEntity, UserEntity } from "@core/persistence/models";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class BlogContext {
    constructor(private readonly context: AppContext) { }


    get dtSource() {
        return this.context.context;
    }

    get posts(): Repository<PostEntity> {
        return this.context.posts;
    }

    get comments(): Repository<CommentEntity> {
        return this.context.comments;
    }

    get postCategories(): Repository<PostCategoryEntity> {
        return this.context.postCategories;
    }

    get postTags(): Repository<PostTagEntity> {
        return this.context.postTags;
    }

    get users(): Repository<UserEntity> {
        return this.context.users;
    }
}