import { Command, ICommand } from "@nestjs/cqrs";
import { Result } from "../responses/result";
import { Logger } from "@nestjs/common";

export type ICommandHandler<TCommand extends ICommand = any, TResult = any> =
    TCommand extends Command<infer InferredCommandResult>
    ? {
        logger: Logger
        execute(command: TCommand): Promise<Result<InferredCommandResult>>;
    }
    : {
        logger: Logger
        execute(command: TCommand): Promise<Result<TResult>>;
    };