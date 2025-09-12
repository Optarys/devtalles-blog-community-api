import { Result } from '@core/common/responses';
import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
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
            const type = this.detectMessageType(message);

            const bus = type === 'command'
                ? this.moduleRef.get(CommandBus, { strict: false })
                : this.moduleRef.get(QueryBus, { strict: false });

            return await this.executeBus(bus, message, type);
        } catch (error) {
            this.logger.error(`${message.constructor.name} failed: ${error}`);

            //return this.handleError(error);
            //return this.handleError2(error);
            this.throwHttpError(error);  // 🔹 lanza excepción automáticamente
        }
    }

    private async executeBus<TMessage extends ICommand | IQuery, TResult>(
        bus: CommandBus | QueryBus,
        message: TMessage,
        type: MessageType
    ): Promise<TResult> {
        if (type === 'command') {
            this.logger.log('Ejecutando Bus de comandos');
            return (bus as CommandBus).execute(message as ICommand);
        } else {
            this.logger.log('Ejecutando Bus de consultas');
            return (bus as QueryBus).execute(message as IQuery);
        }
    }


    // ---------------- HELPERS ----------------
    private detectMessageType(obj: any): MessageType {
        if (obj instanceof Command) return 'command';
        if (obj instanceof Query) return 'query';
        throw new Error(`El mensaje ${obj.constructor.name} no es ni Command ni Query`);
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

    private handleError2(error: any): never {
        if (Array.isArray(error) && error[0] instanceof ValidationError) {
            const messages = this.flattenErrors(error);
            throw new BadRequestException({ message: 'Validation failed', details: messages });
        }

        if (error instanceof HttpException) {
            throw error; // ya tiene status code correcto
        }

        if (error.response) {
            throw new HttpException(error.response, error.status || 500);
        }

        throw new HttpException(error.message || 'Unknown error', 500);
    }

    private throwHttpError(error: any): never {
        if (Array.isArray(error) && error[0] instanceof ValidationError) {
            const messages = this.flattenErrors(error);
            throw new BadRequestException({ message: 'Validation failed', details: messages });
        }

        if (error instanceof HttpException) {
            throw error; // ya tiene status
        }

        if (error.response) {
            throw new HttpException(error.response, error.status || 500);
        }

        throw new HttpException({ message: error.message || 'Unknown error' }, 500);
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

type MessageType = 'command' | 'query';