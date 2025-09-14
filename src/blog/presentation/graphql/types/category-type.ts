import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: 'Representa la categoria asignada a una publicacion' })
export class CategoryType {

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field({ nullable: true })
    description: string;
}