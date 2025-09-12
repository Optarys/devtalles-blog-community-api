import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error?: string;
    public details?: any;
    private _value?: T;

    private constructor(isSuccess: boolean, value?: T, error?: string, details?: any) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._value = value;
        this.error = error;
        this.details = details;
        Object.freeze(this);
    }

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Cannot get the value of a failed result.");
        }
        return this._value as T;
    }

    public static success<U>(value?: U): Result<U> {
        return new Result<U>(true, value);
    }

    public static failure<U>(error: string, details?: any): Result<U> {
        return new Result<U>(false, undefined, error, details);
    }

    /**
     * Ejecuta una función según si es éxito o fallo.
     */
    public match<U>(
        onSuccess: (value: T) => U,
        onFailure: (error?: string | undefined, details?: any) => U
    ): U {
        return this.isSuccess
            ? onSuccess(this.getValue())
            : onFailure(this.error ?? 'Unknown error', this.details);
    }

    /**
     * Lanza un HttpException si el resultado es fallo,
     * usando un formato consistente
     */
    public toHttpError(status: HttpStatus = HttpStatus.BAD_REQUEST): T {
        if (this.isSuccess) return this.getValue();

        throw new HttpException(
            {
                message: this.error ?? 'Unknown error',
                details: this.details,
            },
            status
        );
    }

    /**
     * Combina match con lanzamiento de excepción HTTP:
     * - onSuccess: función para procesar el valor
     * - status: código HTTP si falla
     */
    public matchOrThrow<U>(
        onSuccess: (value: T) => U,
        status: HttpStatus = HttpStatus.BAD_REQUEST
    ): U {
        if (this.isSuccess) return onSuccess(this.getValue());
        throw new HttpException(
            {
                message: this.error ?? 'Unknown error',
                details: this.details,
            },
            status
        );
    }

}