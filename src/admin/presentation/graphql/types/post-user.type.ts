import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostUserType {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    summary: string;

    @Field({ nullable: true })
    publishedAt?: Date;
}