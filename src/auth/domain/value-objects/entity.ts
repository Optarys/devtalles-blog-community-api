import { UniqueEntityID } from "./unique-entity-id";

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;
  protected readonly props: T;

  protected constructor(props: T, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id(): string {
    return this._id.value;
  }
}
