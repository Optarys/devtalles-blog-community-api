import { AppContext } from "@core/persistence/context/app.context";
import { PostCommentEntity, PostEntity, PostCategoryEntity, PostTagEntity, UserEntity } from "@core/persistence/models";
import { PostSavedEntity } from "@core/persistence/models/post_saved.model";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class BlogContext {
    constructor(private readonly context: AppContext) { }


    get dtSource() {
        return this.context.context;
    }

    get postSaved() : Repository<PostSavedEntity>{
        return this.context.postSaved;
    }

    get posts(): Repository<PostEntity> {
        return this.context.posts;
    }

    get postComments(): Repository<PostCommentEntity> {
        return this.context.postComments;
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