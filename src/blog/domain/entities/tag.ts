import { Slug } from "../value-objects/slug";

export class Tag {
  private readonly slug: Slug;
  private readonly name: string;

  constructor(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("El nombre del tag no puede estar vacío");
    }

    this.name = name;
    this.slug = Slug.create(name); // slug generado automáticamente
  }

  getSlug(): string {
    return this.slug.getValue();
  }

  getName(): string {
    return this.name;
  }
}