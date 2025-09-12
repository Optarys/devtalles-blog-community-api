import { AppContext } from "@core/persistence/context/app.context";
import { Comment, Post, PostCategory, PostTag } from "@core/persistence/models";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class BlogContext {
    constructor(private readonly context: AppContext) { }


    get posts(): Repository<Post> {
        return this.context.posts;
    }

    get comments(): Repository<Comment> {
        return this.context.comments;
    }

    get categories(): Repository<PostCategory> {
        return this.context.postCategories;
    }

    get tags(): Repository<PostTag> {
        return this.context.postTags;
    }
}