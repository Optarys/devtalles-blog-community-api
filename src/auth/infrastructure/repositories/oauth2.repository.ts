import { Injectable } from "@nestjs/common";
import { AuthContext } from "../context";

@Injectable()
export class OAuth2Repository {
    constructor(private readonly context: AuthContext){}
}