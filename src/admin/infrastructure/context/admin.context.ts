import { AppContext } from "@core/persistence/context/app.context";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminContext {

    constructor(private readonly context: AppContext) { }

    get users() {
        return this.context.users;
    }

    get roles() {
        return this.context.roles;
    }

    get posts() {
        return this.context.posts;
    }

    get savedPosts() {
        return this.context.postSaved;
    }

    get postComments() {
        return this.context.postComments;
    }
}