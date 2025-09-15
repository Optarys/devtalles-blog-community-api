// core/domain/primitives/unique-entity-id.ts
import { randomUUID } from "crypto";

export class UniqueEntityID {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  get value(): string {
    return this._value;
  }
}