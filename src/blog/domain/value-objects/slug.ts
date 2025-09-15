export class Slug {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): Slug {
        if (!value || value.trim().length === 0) {
            throw new Error("Slug no puede estar vacío");
        }

        // Normalizar
        let normalized = value.trim().toLowerCase();

        // Reemplazar espacios por guiones
        normalized = normalized.replace(/\s+/g, "-");

        // Eliminar caracteres inválidos
        normalized = normalized.replace(/[^a-z0-9-]/g, "");

        if (normalized.length === 0) {
            throw new Error("Slug inválido");
        }

        return new Slug(normalized);
    }

    equals(other: Slug): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return this.value;
    }

    toString(): string {
        return this.value;
    }
}
