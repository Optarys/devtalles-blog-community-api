import { Command } from "@nestjs/cqrs"

export class ExchangeCodeCommand extends Command<any> {
    constructor(public readonly code: string) {
        super();
    }
}