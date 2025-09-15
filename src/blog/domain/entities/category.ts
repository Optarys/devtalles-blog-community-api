import { Slug } from "../value-objects/slug";

export class Category {
    private id: number;
    private readonly slug: Slug;
    private readonly name: string;

    constructor(name: string) {
        if (!name || name.trim().length === 0) {
            throw new Error("El nombre del tag no puede estar vacío");
        }

        this.name = name;
        this.slug = Slug.create(name); // slug generado automáticamente
    }

    setId(id: number) {
        this.id = id;
        return this;

    }
    getId(): number {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getSlug(): string {
        return this.slug.getValue();
    }
}
