import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({description: 'Representa el tag asignado a una publicacion para temas de busquedas, seo, etc'})
export class TagType {
    @Field()
    name: string;

    @Field()
    slug: string;
}