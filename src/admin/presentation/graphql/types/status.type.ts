import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StatusType {
    @Field()
    code: string;

    @Field()
    name: string;

    @Field()
    description: string;
}