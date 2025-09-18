import { ICommandHandler } from "@core/common/handlers";
import { SavePostCommand } from "./save-post.command";
import { Result } from "@core/common/responses";
import { Logger } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { BlogContext } from "@blog/infrastructure/context";

@CommandHandler(SavePostCommand)
export class SavePostHandler implements ICommandHandler<SavePostCommand> {
    logger: Logger = new Logger(SavePostHandler.name);

    constructor(private readonly context: BlogContext){}
    

    execute(command: SavePostCommand): Promise<Result<any>> {
        throw new Error("Method not implemented.");
    }

}