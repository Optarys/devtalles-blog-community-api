import { AppContext } from "@core/persistence/context/app.context";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthContext {

    constructor(private readonly context: AppContext) { }

    get roles() {
        return this.context.roles;
    }

    get users() {
        return this.context.users;
    }
}