import { Result } from '@core/common/responses';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ICommand, Command, IQuery, Query, CommandBus, QueryBus } from '@nestjs/cqrs';
import { validateOrReject, ValidationError } from 'class-validator';
import { getMetadataStorage } from 'class-validator';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class MediatorService {
    private readonly logger = new Logger(MediatorService.name);

    constructor(private readonly moduleRef: ModuleRef) { }

    async execute<
        TMessage extends ICommand | IQuery,
        TResult = TMessage extends Command<infer CR>
        ? CR
        : TMessage extends Query<infer QR>
        ? QR
        : any
    >(message: TMessage): Promise<Result<TResult>> {
        try {
            this.logger.log(`Checking validators for: ${message.constructor.name}`);

            if (this.hasValidationMetadata(message)) {
                this.logger.log(`Validating: ${message.constructor.name}`);
                await validateOrReject(message as object);
                this.logger.log(`${message.constructor.name} passed validation`);
            } else {
                this.logger.log(`${message.constructor.name} has no validators, skipping validation`);
            }

            // ✅ Resuelve dinámicamente el bus correspondiente
            const bus = this.isCommand(message)
                ? this.moduleRef.get(CommandBus, { strict: false })
                : this.moduleRef.get(QueryBus, { strict: false });

            console.log(bus);

            return await this.executeBus(bus, message);
        } catch (error) {
            this.logger.error(`${message.constructor.name} failed: ${error}`);
            return this.handleError(error);
        }
    }

    private async executeBus<TMessage extends ICommand | IQuery, TResult>(
        bus: CommandBus | QueryBus,
        message: TMessage,
    ): Promise<TResult> {
        
        if (this.isCommand(message)) {
            this.logger.log('Ejecutando Bus de comandos')
            return (bus as CommandBus).execute(message as ICommand);
        } else {
             this.logger.log('Ejecutando Bus de consultas')
            return (bus as QueryBus).execute(message as IQuery);
        }
    }


    // ---------------- HELPERS ----------------
    private isCommand(obj: any): obj is ICommand {
        return obj.constructor.name.endsWith('Command');
    }

    private handleError(error: any): Result<any> {
        if (Array.isArray(error) && error[0] instanceof ValidationError) {
            const messages = this.flattenErrors(error);
            return Result.failure('Validation failed', messages);
        }

        if (error instanceof HttpException) {
            const response = error.getResponse();
            const message =
                typeof response === 'string' ? response : (response as any).message;
            return Result.failure(message || error.message, response);
        }

        if (error.response) {
            return Result.failure(error.response.message || error.message, error.response);
        }

        return Result.failure(error.message || 'Unknown error');
    }

    private flattenErrors(
        errors: ValidationError[],
        parentPath = '',
    ): { property: string; message: string }[] {
        const result: { property: string; message: string }[] = [];

        for (const err of errors) {
            const path = parentPath ? `${parentPath}.${err.property}` : err.property;

            if (err.constraints) {
                for (const key of Object.keys(err.constraints)) {
                    result.push({
                        property: path,
                        message: err.constraints[key],
                    });
                }
            }

            if (err.children?.length) {
                result.push(...this.flattenErrors(err.children, path));
            }
        }

        return result;
    }

    private hasValidationMetadata(obj: object): boolean {
        const target = obj.constructor;
        const metadata = getMetadataStorage().getTargetValidationMetadatas(
            target,
            target.name,
            false,
            false,
        );
        return metadata.length > 0;
    }
}