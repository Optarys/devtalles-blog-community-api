import { UniqueEntityID } from "../value-objects/unique-entity-id";
import { Email } from "../value-objects/email";
import { UserStatus } from "../value-objects/user-status";
import { AggregateRoot } from "../primitives/aggregate-root";

export class User extends AggregateRoot {
    private constructor(
        public readonly id: UniqueEntityID,
        private _email: Email | null,
        private _firstName: string,
        private _lastName: string,
        private _userName: string,
        private _password?: string,
        private _status: UserStatus = UserStatus.PENDING
    ) {
        super();
    }

    // 🔹 Factoría estática para crear usuarios
    public static create(props: {
        email?: string;
        firstName: string;
        lastName: string;
        userName: string;
        password?: string;
        status?: UserStatus;
    }, id?: UniqueEntityID): User {
        return new User(
            id ?? new UniqueEntityID(),
            props.email ? Email.create(props.email) : null,
            props.firstName,
            props.lastName,
            props.userName,
            props.password,
            props.status ?? UserStatus.PENDING
        );
    }

    // 🔹 Reglas de negocio
    get email(): Email | null {
        return this._email;
    }

    get fullName(): string {
        return `${this._firstName} ${this._lastName}`;
    }

    activate(): void {
        this._status = UserStatus.ACTIVE;
    }

    deactivate(): void {
        this._status = UserStatus.INACTIVE;
    }

    changeEmail(newEmail: string): void {
        this._email = Email.create(newEmail);
    }

    checkPassword(password: string): boolean {
        return this._password === password; // ⚠️ en infra debes aplicar hash
    }
}
