export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      throw new Error("Email inválido");
    }
    this._value = value.toLowerCase();
  }

  static create(value: string): Email {
    return new Email(value);
  }

  get value(): string {
    return this._value;
  }
}