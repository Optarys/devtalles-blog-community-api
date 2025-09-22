import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoleType {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;
}