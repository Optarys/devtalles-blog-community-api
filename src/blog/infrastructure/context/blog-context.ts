import { AppContext } from "@core/persistence/context/app.context";
import { Comment, PostEntity, PostCategory, PostTag, User } from "@core/persistence/models";
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

    get comments(): Repository<Comment> {
        return this.context.comments;
    }

    get postCategories(): Repository<PostCategory> {
        return this.context.postCategories;
    }

    get postTags(): Repository<PostTag> {
        return this.context.postTags;
    }

    get postAuthor(): Repository<User> {
        return this.context.users;
    }
}